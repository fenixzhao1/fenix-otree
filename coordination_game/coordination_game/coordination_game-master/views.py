import math
from datetime import timedelta
from operator import concat
from functools import reduce
from .models import parse_config

def get_config_columns(group):
    config = parse_config(group.session.config['config_file'])[group.round_number - 1]
    payoffs = config['payoff_matrix']
    payoffs = reduce(concat, payoffs)

    return payoffs + [
        config['num_subperiods'],
        config['pure_strategy'],
        config['shuffle_role'],
        config['show_at_worst'],
        config['show_best_response'],
        config['rate_limit'],
        config['mean_matching'],
        config['communication'],
        config['signal_exist'],
        config['signal_freq'],
        config['signaltwo_exist'],
        config['signaltwo_freq'],
        config['signalthree_exist'],
    ]

def get_output_table_header(groups):
    num_silos = groups[0].session.config['num_silos']
    max_num_players = max(len(g.get_players()) for g in groups)

    header = [
        'payoff1Aa',
        'payoff2Aa',
        'payoff1Ab',
        'payoff2Ab',
        'payoff1Ba',
        'payoff2Ba',
        'payoff1Bb',
        'payoff2Bb',
        'num_subperiods',
        'pure_strategy',
        'role_shuffle',
        'show_at_worst',
        'show_best_response',
        'rate_limit',
        'mean_matching',
        'communication',
        'signal_exist',
        'signal_freq',
        'signaltwo_exist',
        'signaltwo_freq',
        'signalthree_exist',
    ]

    header += [
        'session_code',
        'subsession_id',
        'id_in_subsession',
        'silo_num',
        'tick',
    ]

    for player_num in range(1, max_num_players + 1):
        header.append('p{}_code'.format(player_num))
        header.append('p{}_role'.format(player_num))
        header.append('p{}_strategy'.format(player_num))
        header.append('p{}_target'.format(player_num))

    return header


def get_output_table(events):
    if not events:
        return []
    if events[0].group.num_subperiods() == 0:
        return get_output_cont_time(events)
    else:
        return get_output_discrete_time(events)


# build output for a round of continuous time bimatrix
def get_output_cont_time(events):
    rows = []
    minT = min(e.timestamp for e in events if e.channel == 'state')
    maxT = max(e.timestamp for e in events if e.channel == 'state')
    group = events[0].group
    players = group.get_players()
    max_num_players = math.ceil(group.session.num_participants / group.session.config['num_silos'])
    config_columns = get_config_columns(group)
    # sets sampling frequency
    ticks_per_second = 2
    decisions = {p.participant.code: float('nan') for p in players}
    targets = {p.participant.code: float('nan') for p in players}
    for tick in range((maxT - minT).seconds * ticks_per_second):
        currT = minT + timedelta(seconds=(tick / ticks_per_second))
        cur_decision_event = None
        while events[0].timestamp <= currT:
            e = events.pop(0)
            if e.channel == 'group_decisions':
                cur_decision_event = e
            elif e.channel == 'target':
                targets[e.participant.code] = e.value
        if cur_decision_event:
            decisions.update(cur_decision_event.value)
        row = []
        row += config_columns
        row += [
            group.session.code,
            group.subsession_id,
            group.id_in_subsession,
            players[0].silo_num,
            tick,
        ]
        for player_num in range(max_num_players):
            if player_num >= len(players):
                row += ['', '', '', '']
            else:
                pcode = players[player_num].participant.code
                row += [
                    pcode,
                    players[player_num].role(),
                    decisions[pcode],
                    targets[pcode],
                ]
        rows.append(row)
    return rows


# build output for a round of discrete time bimatrix
def get_output_discrete_time(events):
    rows = []
    players = events[0].group.get_players()
    group = events[0].group
    max_num_players = math.ceil(group.session.num_participants / group.session.config['num_silos'])
    config_columns = get_config_columns(group)
    tick = 0
    targets = {p.participant.code: float('nan') for p in players}
    for event in events:
        if event.channel == 'target':
            targets[event.participant.code] = event.value
        elif event.channel == 'group_decisions':
            row = []
            row += config_columns
            row += [
                group.session.code,
                group.subsession_id,
                group.id_in_subsession,
                players[0].silo_num,
                tick,
            ]
            for player_num in range(max_num_players):
                if player_num >= len(players):
                    row += ['', '', '', '']
                else:
                    pcode = players[player_num].participant.code
                    row += [
                        pcode,
                        players[player_num].role(),
                        event.value[pcode],
                        targets[pcode],
                    ]
            rows.append(row)
            tick += 1
    return rows

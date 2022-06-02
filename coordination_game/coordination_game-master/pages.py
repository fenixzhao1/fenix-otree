import math
from ._builtin import Page, WaitPage

from datetime import timedelta
from operator import concat
from functools import reduce
from .models import parse_config

class Introduction(Page):

    def is_displayed(self):
        return self.round_number == 1


class CommunicationWaitPage(WaitPage):

    body_text = 'Waiting for all players to be ready'
    wait_for_all_groups = True
    #after_all_players_arrive = 'set_initial_decisions'

    def is_displayed(self):
        return self.subsession.config is not None and parse_config(self.group.session.config['config_file'])[self.group.round_number - 1]['communication'] != 0


class Communication(Page):
    timeout_seconds = 40
    form_model = 'player'
    form_fields = ['_message']


    def is_displayed(self):
        return self.subsession.config is not None and parse_config(self.group.session.config['config_file'])[self.group.round_number - 1]['communication'] != 0
    
    def vars_for_template(self):
        communication = parse_config(self.group.session.config['config_file'])[self.group.round_number - 1]['communication']

        periods = max(int(parse_config(self.group.session.config['config_file'])[self.group.round_number - 1]['num_subperiods']), 1)

        return {
            'realtime': True if communication == 2 else False,
            'channel': str(self.group.session.code)+ "_" + str(self.group.subsession_id) + "_" + str(self.group.id_in_subsession),
            'secs_per_per': int(parse_config(self.group.session.config['config_file'])[self.group.round_number - 1]['period_length']) / periods
        }

class CommunicationReceiveWaitPage(WaitPage):

    body_text = 'Waiting for all players to be ready'
    wait_for_all_groups = True
    #after_all_players_arrive = 'set_initial_decisions'

    def is_displayed(self):
        return self.subsession.config is not None and parse_config(self.group.session.config['config_file'])[self.group.round_number - 1]['communication'] == 1

class CommunicationReceive(Page):
    timeout_seconds = 20

    def is_displayed(self):
        return self.subsession.config is not None and parse_config(self.group.session.config['config_file'])[self.group.round_number - 1]['communication'] == 1
    
    def vars_for_template(self):
        messages = [ { 'player': 'Counterpart' , 'message': p.message()} for p in self.group.get_players() if p.role() != self.player.role()]
        messages.append({'player': 'Me', 'message':self.player.message() })
        return {
            'messages': messages,
        }

class DecisionWaitPage(WaitPage):

    body_text = 'Waiting for all players to be ready'
    wait_for_all_groups = True
    after_all_players_arrive = 'set_initial_decisions'

    def is_displayed(self):
        return self.subsession.config is not None


class Decision(Page):

    def is_displayed(self):
        return self.subsession.config is not None


class ResultsWaitPage(WaitPage):

    after_all_players_arrive = 'set_payoffs'

    def is_displayed(self):
        return self.subsession.config is not None


class Results(Page):

    timeout_seconds = 15

    def is_displayed(self):
        return self.subsession.config is not None

    def vars_for_template(self):
        period_start = self.group.get_start_time()
        period_end = self.group.get_end_time()
        if None in (period_start, period_end):
            # I really don't like having to repeat these keys twice but I can't think of any clean way to avoid it
            return {
                'counter_average_payoff': float('nan'),
                'counter_freq_top' : float('nan'),
                'counter_freq_bottom' : float('nan'),
                'freq_top' : float('nan'),
                'freq_bottom' : float('nan'),
            }
        decisions = self.group.get_group_decisions_events()

        counter_payoffs = [ p.payoff for p in self.group.get_players() if p.role() != self.player.role() ]
        # keep role strategies in a dict so that my avg. strategy can be retrieved
        # prevents from having to compute my average strategy twice
        #role_strategies = {
        #    p.participant.code: p.get_average_strategy(period_start, period_end, decisions)
        #    for p in self.group.get_players() if p.role() == self.player.role()
        #}

        counter_frequencies_top = [ p.get_frequency( 1, decisions) for p in self.group.get_players() if p.role() != self.player.role() ]
        counter_frequencies_bottom = [ p.get_frequency( 0, decisions) for p in self.group.get_players() if p.role() != self.player.role() ]
        
        freq_top = self.player.get_frequency( 1, decisions)
        freq_bottom = self.player.get_frequency( 0, decisions)

        return {
            'counter_average_payoff': sum(counter_payoffs) / len(counter_payoffs),
            'counter_freq_top' : sum(counter_frequencies_top) / len(counter_frequencies_top),
            'counter_freq_bottom' : sum(counter_frequencies_bottom) / len(counter_frequencies_bottom),
            'freq_top' : freq_top,
            'freq_bottom' : freq_bottom,

        }

class Payment(Page):

    def is_displayed(self):
        return self.round_number == self.subsession.num_rounds()
    
    def vars_for_template(self):

        return {
            'payoff': self.player.in_round(self.session.vars['payment_round']).payoff,
            'payoff_round': self.session.vars['payment_round'],
        }


page_sequence = [
    Introduction,
    CommunicationWaitPage,
    Communication,
    CommunicationReceiveWaitPage,
    CommunicationReceive,
    DecisionWaitPage,
    Decision,
    ResultsWaitPage,
    Results,
    Payment
]

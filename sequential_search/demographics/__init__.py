from otree.api import *


class Constants(BaseConstants):
    name_in_url = 'demographics'
    players_per_group = None
    num_rounds = 1


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    last_name = models.StringField(label='What is your last name?')
    first_name = models.StringField(label='What is your first name?')
    ucscID = models.IntegerField(label='What is your UCSC student ID number', min=0000000, max=9999999)
    email = models.StringField(label='What is your UCSC email address?')
    age = models.IntegerField(label='What is your age?', min=13, max=100)
    gender = models.StringField(
        choices=[['Male', 'Male'], ['Female', 'Female'], ['Other', 'Other']], 
        label='What is your gender?',
        # widget=widgets.RadioSelect,
    )
    ethnicity = models.StringField(
        choices=[['American Indian or Alaska Native', 'American Indian or Alaska Native'], 
        ['Asian', 'Asian'], ['Black or African American', 'Black or African American'], 
        ['Native Hawaiian or Other Pacific Islander', 'Native Hawaiian or Other Pacific Islander'], 
        ['White', 'White'], ['Other', 'Other'] , ['Prefer not to say', 'Prefer not to say']], 
        label='What is your ethnic group?',
        # widget=widgets.RadioSelect,
    )
    participantID = models.StringField(label='What is your participant ID (Zoom Username)?')
    venmoID = models.StringField(label='What is your Venmo ID?')
    searchcomment = models.LongStringField(label='How did you make your decision in the Search task?')
    bretcomment = models.LongStringField(label='How did you make your decision in the BRET task?')
    mplcomment = models.LongStringField(label='How did you make your decision in the MPL task?')
    suggest = models.LongStringField(label='Do you have any other suggestion on the experiment?')
    total_pay = models.CurrencyField()

# FUNCTIONS
# PAGES

class FinalResults(Page):
    # def is_displayed(self):
    #     return self.subsession.round_number == Constants.num_rounds

    @staticmethod
    def vars_for_template(player: Player):
        player.total_pay = player.participant.vars['search_pay'] + player.participant.vars['bret_payoff'] + player.participant.vars['mpl_payoff']
        return {
            'search_pay': player.participant.vars['search_pay'], 
            'bomb_pay': player.participant.vars['bret_payoff'], 
            'mpl_pay': player.participant.vars['mpl_payoff'], 
            'total_pay': player.total_pay, 
        }


class Demographics(Page):
    form_model = 'player'
    form_fields = ['last_name', 'first_name', 'ucscID', 'email', 'age', 'gender', 'ethnicity', 'participantID', 'venmoID', 'searchcomment', 'bretcomment', 'mplcomment', 'suggest']


class Results(Page):
    @staticmethod
    def vars_for_template(player: Player):
        return dict(player=player)


page_sequence = [FinalResults, Demographics, Results]

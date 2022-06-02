import os
from os import environ

import otree.settings

SESSION_CONFIGS = [
    dict(
        name='salience_market',
        display_name='Salience Market',
        num_demo_participants=2,
        app_sequence=['salience_market'],
        config_file='demo.csv',
    ),

    dict(
        name='search_experiment_control',
        display_name='Sequential Search (Manual Certainty)',
        app_sequence=['search', 'bret_practice', 'bret', 'mpl','demographics'],
        num_demo_participants=1,
        # config_file = "search_pilot.csv",
        value_high = 500,
        value_low = 100,
        search_cost = 5,
        lottery_a = 280,
        lottery_b_hi = 500,
        lottery_b_lo = 100,
        random = True,
        certainty = False,
        control = True,
        automatic = False,
    ),

    dict(
        name='search_experiment_uncertainty',
        display_name='Sequential Search (Manual Uncertainty)',
        app_sequence=['search', 'bret_practice', 'bret', 'mpl','demographics'],
        num_demo_participants=1,
        # config_file = "search_pilot.csv",
        value_high = 500,
        value_low = 100,
        search_cost = 5,
        lottery_a = 280,
        lottery_b_hi = 500,
        lottery_b_lo = 100,
        random = True,
        certainty = False,
        control = False,
        automatic = False,
    ),

    dict(
        name='coordination_game',
        display_name='Coordination Games',
        num_demo_participants=2,
        app_sequence=['coordination_game'],
        config_file='demo.csv',
        num_silos=1,
    ),
]

# if you set a property in SESSION_CONFIG_DEFAULTS, it will be inherited by all configs
# in SESSION_CONFIGS, except those that explicitly override it.
# the session config can be accessed from methods in your apps as self.session.config,
# e.g. self.session.config['participation_fee']

SESSION_CONFIG_DEFAULTS = dict(
    real_world_currency_per_point=1.00, participation_fee=5.00, doc=""
)

PARTICIPANT_FIELDS = []
SESSION_FIELDS = []

# ISO-639 code
# for example: de, fr, ja, ko, zh-hans
LANGUAGE_CODE = 'en'

# e.g. EUR, GBP, CNY, JPY
REAL_WORLD_CURRENCY_CODE = 'USD'
USE_POINTS = True

ROOMS = [
    dict(
        name='session_room',
        display_name='Session Room',
        participant_label_file='_rooms/participant_label.txt',
        # use_secure_urls=True
    ),
]

ADMIN_USERNAME = 'admin'
# for security, best to set admin password in an environment variable
ADMIN_PASSWORD = environ.get('OTREE_ADMIN_PASSWORD')

DEMO_PAGE_INTRO_HTML = """
Fenix Shuchen Zhao oTree Homepage
"""

SECRET_KEY = '6629196293936'

INSTALLED_APPS = ['otree', 'django_extensions']

EXTENSION_APPS = ['otree_redwood', 'otree_markets']

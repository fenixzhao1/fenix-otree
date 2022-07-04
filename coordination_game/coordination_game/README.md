# Coordination Games Experiments

coordination_game is an oTree app for a realtime bimatrix experiment. It supports both discrete and mixed strategies, as well as continuous and discrete time games.

coordination_game was built using [otree-redwood](https://github.com/Leeps-Lab/otree-redwood).

### Suggested session config:

```
dict(
    name='coordination_game',
    display_name='Coordination Games',
    num_demo_participants=2,
    app_sequence=['coordination_game'],
    config_file='demo.csv',
    num_silos=1,
),
```

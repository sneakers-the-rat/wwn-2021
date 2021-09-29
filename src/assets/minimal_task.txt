class Nafc(Task):
    """
    Minimal two-alternative forced-choice task.

    mouse hear sound,
    mouse poke nose,
    mouse decide destiny
    """

    PARAMS = {
        'stim':   {'tag'  : 'Sound Stimuli',
                   'type' : 'sounds'},
        'reward': {'tag'  : 'Reward Duration (ms)',
                   'type' : 'int'}
    }

    class TrialData(tables.IsDescription):
        target  = tables.StringCol(1)
        correct = tables.BoolCol()

    PLOT = {
        'data':   {'target'  : 'point',
                   'correct' : 'rollmean'},
        'params': {'roll_window' : 50}
    }

    HARDWARE = {
        'POKES':{
            'L': hardware.Beambreak,
            'R': hardware.Beambreak
        },
        'PORTS':{
            'C': hardware.Solenoid
        }
    }

    def __init__(self, stim, reward=10):

        self.init_hardware()

        self.stim_mgr = Stim_Manager(stim)
        self.reward   = Reward_Manager(reward)

        stage_list  = [self.discrim, self.reinforcement]
        self.stages = itertools.cycle(stage_list)

        self.stages.next()()

    def discrim(self):
        target, wrong, stim = self.stim_mgr.next()
        self.target = target

        self.triggers[target] = [
            self.hardware['PORTS']['C'].open,
            self.stages.next()
            ]

        self.triggers[wrong] = self.stages.next()

        self.node.send('DATA', {'target':target})

        stim.play()

    def reinforcement(self, response):
        if response == self.target:
            self.node.send('DATA', {'correct':True}
        else:
            self.node.send('DATA', {'correct':False}

        self.stages.next()()






























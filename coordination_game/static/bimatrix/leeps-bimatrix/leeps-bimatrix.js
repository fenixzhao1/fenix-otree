import {html,PolymerElement} from '/static/otree-redwood/node_modules/@polymer/polymer/polymer-element.js';
import '../polymer-elements/iron-flex-layout-classes.js';
import '../polymer-elements/paper-progress.js';
import '../polymer-elements/paper-radio-button.js';
import '../polymer-elements/paper-radio-group.js';

import '/static/otree-redwood/src/redwood-decision/redwood-decision.js';
import '/static/otree-redwood/src/redwood-period/redwood-period.js';
import '/static/otree-redwood/src/redwood-decision-bot/redwood-decision-bot.js';
import '/static/otree-redwood/src/otree-constants/otree-constants.js';

import '../bimatrix-heatmap/bimatrix-heatmap.js';
import '../heatmap-thermometer/heatmap-thermometer.js';
import '../payoff-graph/payoff-graph.js';
import '../subperiod-payoff-graph/subperiod-payoff-graph.js';
import '../strategy-graph/strategy-graph.js';
import '../subperiod-strategy-graph/subperiod-strategy-graph.js';
import '../styled-range/styled-range.js';
import '../discrete-mean-matching-heatmap/discrete-mean-matching-heatmap.js';

import '../color.js';


export class LeepsBimatrix extends PolymerElement {

    static get template() {
        return html `
            <style include="iron-flex iron-flex-alignment"></style>
            <style>
                :host {
                    display: block;
                    margin: 30px 0 40px 0;
                    user-select: none;
                }

                .dot {
                    font-size: 65px;
                    font-weight: bold;
                    display: inline-block;
                }

                #graphs-column {
                    margin-left: 20px;
                }

                #your-heatmap {
                    margin-top: 30px;
                }

                #payoff-table {
                    width: 300px;
                    height: 300px;
                    border-collapse: collapse;
                    border: 1px solid black;
                }

                #payoff-table tr td {
                    height: 50%;
                    width: 50%;
                }

                .your-payoff {
                    font-weight: bold;
                    font-size: 16pt;
                }

                .other-payoff {
                    font-size: 14pt;
                }

                paper-radio-group {
                    height: 300px;
                }

                #payoff-table td {
                    border: 1px solid black;
                    text-align: center;
                    vertical-align: center;
                }

                styled-range {
                    transform: rotate(270deg) translateX(-100%);
                    transform-origin: 0 0px;
                    width: 315px;
                    height: 50px;
                }

                .slider-container {
                    margin-top: 13px;
                    width: 50px;
                    height: 315px;
                }

                heatmap-thermometer {
                    margin-bottom: 20px;
                    height: 243px;
                }

                strategy-graph, subperiod-strategy-graph {
                    width: 510px;
                    height: 200px;
                }

                payoff-graph, subperiod-payoff-graph {
                    width: 510px;
                    height: 305px;
                }

                paper-progress {
                    margin-bottom: 10px;
                    --paper-progress-height: 30px;
                }
                

                .light-blue {
                    background-color: #b5d9ff;
                }

                .blue {
                    background-color: #39f;
                }

            </style>
            <style>
                .meter { 
                    height: 30px;
                    position: relative;
                    background: #f3efe6;
                    overflow: hidden;
                }

                .meter span {
                    display: block;
                    height: 100%;
                }

                @keyframes progressBar {
                    0% { width: 0; }
                    100% { width: 100%; }
                }

                @-webkit-keyframes progressBar {
                    0% { width: 0; }
                    100% { width: 100%; }
                }

                @-moz-keyframes progressBar {
                    0% { width: 0; }
                    100% { width: 100%; }
                }

                .progress {
                    background-color: #008000;
                    animation: progressBar 6s ease-in-out infinite;
                    animation-fill-mode:both;
                    -webkit-animation: progressBar 6s ease-in-out infinite;
                    -webkit-animation-fill-mode:both; 
                    -moz-animation: progressBar 6s ease-in-out infinite;
                    -moz-animation-fill-mode:both; 
                }
            </style>
            

            <otree-constants id="constants"></otree-constants>
            <redwood-period
                running="{{ _isPeriodRunning }}"
                on-period-start="_onPeriodStart"
                on-period-end="_onPeriodEnd">
            </redwood-period>

            <redwood-decision
                initial-decision="[[ initialDecision ]]"
                my-decision="{{ myPlannedDecision }}"
                my-current-decision="{{ myDecision }}"
                group-decisions="{{ groupDecisions }}"
                max-per-second="10"
                on-group-decisions-changed="_onGroupDecisionsChanged"
                mean-matching="[[ meanMatching ]]">
            </redwood-decision>

            <redwood-channel
                channel="group_decisions"
                on-event="_handleGroupDecisionsEvent">
            </redwood-channel>

            <div class="layout vertical center">
            
                <div class="layout vertical end">
                    

                    <template is="dom-if" if="[[ signalthreeExist ]]">
                        <div class="layout vertical center">
                            <div class="layout vertical end">
                                <div class="meter" style="width:13%;position: absolute;margin-bottom: 10px;">
                                        <span style="width:100%;"><span class="progress"></span></span>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template is="dom-if" if="[[ signalthreeExist ]]">
                        <div style="height:60px;">
                        </div>
                    </template>

                    <template is="dom-if" if="[[ numSubperiods ]]">
                        <paper-progress
                            value="[[ _subperiodProgress ]]">
                        </paper-progress>
                    </template>
                    

                    <div class="layout horizontal">
                        <div class="layout vertical">
                            <template is="dom-if" if="[[ signalExist ]]">
                               <div class="layout horizontal around-justified self-center" style="margin-bottom:10px;">
                                    <p class="dot" id="signal">@</p>
                                </div>
                            </template>
                            <div id="heatmap-column" class="layout horizontal">
                                <template is="dom-if" if="[[ pureStrategy ]]">
                                    <paper-radio-group
                                        class="layout vertical around-justified self-center"
                                        selected="{{ _myPlannedDecisionString }}">
                                        <paper-radio-button name="1"></paper-radio-button>
                                        <paper-radio-button name="0"></paper-radio-button>
                                    </paper-radio-group>

                                    <template is="dom-if" if="[[ meanMatching ]]">
                                        <discrete-mean-matching-heatmap
                                            class="self-center"
                                            my-decision="[[ myDecision ]]"
                                            other-decision="[[ otherDecision ]]"
                                            size="300"
                                            payoffs="[[ myPayoffs ]]"
                                            color="[[ myColor ]]">
                                        </discrete-mean-matching-heatmap>
                                    </template>
                                    <template is="dom-if" if="[[ !meanMatching ]]">
                                        <table id="payoff-table" class="self-center">
                                            <tr>
                                                <td class$="[[ _payoffMatrixClass(myPlannedDecision, otherDecision, 1, 1) ]]">
                                                    <span class="your-payoff">
                                                        [[ _array(myPayoffs, 0) ]]
                                                    </span>,
                                                    <span class="other-payoff">
                                                        [[ _array(otherPayoffs, 0) ]]
                                                    </span>
                                                </td>
                                                <td class$="[[ _payoffMatrixClass(myPlannedDecision, otherDecision, 1, 0) ]]">
                                                    <span class="your-payoff">
                                                        [[ _array(myPayoffs, 1) ]]
                                                    </span>,
                                                    <span class="other-payoff">
                                                        [[ _array(otherPayoffs, 1) ]]
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class$="[[ _payoffMatrixClass(myPlannedDecision, otherDecision, 0, 1) ]]">
                                                    <span class="your-payoff">
                                                        [[ _array(myPayoffs, 2) ]]
                                                    </span>,
                                                    <span class="other-payoff">
                                                        [[ _array(otherPayoffs, 2) ]]
                                                    </span>
                                                </td>
                                                <td class$="[[ _payoffMatrixClass(myPlannedDecision, otherDecision, 0, 0) ]]">
                                                    <span class="your-payoff">
                                                        [[ _array(myPayoffs, 3) ]]
                                                    </span>,
                                                    <span class="other-payoff">
                                                        [[ _array(otherPayoffs, 3) ]]
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </template>
                                </template>
                                <template is="dom-if" if="[[ !pureStrategy ]]">
                                    <div class="layout vertical start">
                                        <bimatrix-heatmap
                                            id="counterpart-heatmap"
                                            size="120"
                                            my-decision="[[ myPlannedDecision ]]"
                                            other-decision="[[ otherDecision ]]"
                                            payoffs="[[ otherPayoffs ]]"
                                            color="[[ otherColor ]]">
                                        </bimatrix-heatmap>
                                        <div id="your-heatmap" class="layout horizontal start">
                                            <div class="slider-container">
                                                <styled-range
                                                    min="0"
                                                    max="1"
                                                    step="0.01"
                                                    disabled="[[ !_isPeriodRunning ]]"
                                                    value="{{ myPlannedDecision }}"
                                                    rate-limit="[[ rateLimit ]]"
                                                    initial-value="[[ initialDecision ]]">
                                                </styled-range>
                                            </div>
                                            <bimatrix-heatmap
                                                size="300"
                                                my-decision="[[ myPlannedDecision ]]"
                                                other-decision="[[ otherDecision ]]"
                                                payoffs="[[ myPayoffs ]]"
                                                color="[[ myColor ]]"
                                                show-at-worst="{{ showAtWorst }}"
                                                show-best-response="{{ showBestResponse }}">
                                            </bimatrix-heatmap>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <div id="graphs-column" class="layout horizontal">
                            <div class="layout horizontal end">
                                <template is="dom-if" if="[[ _showThermometer(pureStrategy, meanMatching) ]]">
                                    <heatmap-thermometer
                                        color="rainbow"
                                        class="self-end">
                                    </heatmap-thermometer>
                                </template>
                                <div class="layout vertical">
                                    <template is="dom-if" if="[[ !numSubperiods ]]">
                                        <strategy-graph
                                            my-decision="[[ myPlannedDecision ]]"
                                            other-decision="[[ otherDecision ]]"
                                            period-length="[[ periodLength ]]"
                                            my-choice-series="[[ myChoiceSeries ]]"
                                            other-choice-series="[[ otherChoiceSeries ]]"
                                        ></strategy-graph>
                                        <payoff-graph
                                            my-decision="[[ myPlannedDecision ]]"
                                            other-decision="[[ otherDecision ]]"
                                            my-payoffs="[[ myPayoffs ]]"
                                            other-payoffs="[[ otherPayoffs ]]"
                                            period-length="[[ periodLength ]]"
                                            my-payoff-series="[[ myPayoffSeries ]]"
                                            other-payoff-series="[[ otherPayoffSeries ]]"
                                        ></payoff-graph>
                                    </template>
                                    <template is="dom-if" if="[[ numSubperiods ]]">
                                        <subperiod-strategy-graph
                                            my-decision="[[ myDecision ]]"
                                            other-decision="[[ otherDecision ]]"
                                            period-length="[[ periodLength ]]"
                                            num-subperiods="[[ numSubperiods ]]"
                                        ></subperiod-strategy-graph>
                                        <subperiod-payoff-graph
                                            my-payoffs="[[ myPayoffs ]]"
                                            other-payoffs="[[ otherPayoffs ]]"
                                            period-length="[[ periodLength ]]"
                                            num-subperiods="[[ numSubperiods ]]"
                                        ></subperiod-payoff-graph>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        `
    }

    static get properties() {
        return {
            payoffMatrix: Array,
            initialDecision: {
                type: Number,
            },
            myPlannedDecision: {
                type: Number,
            },
            groupDecisions: {
                type: Object,
            },
            myDecision: {
                type: Number,
            },
            // can't use otherDecision from redwood-decision because of mean matching special case
            otherDecision: {
                type: Number,
                computed: '_computeOtherDecision(groupDecisions)',
            },
            periodLength: Number,
            numSubperiods: {
                type: Number,
                value: 0
            },
            pureStrategy: {
                type: Boolean,
                value: false
            },
            timer: {
                type: Number,
                value: 0
            },
            timerTwo: {
                type: Number,
                value: 0
            },
            showAtWorst: {
                type: Boolean,
                value: false,
            },
            showBestResponse: {
                type: Boolean,
                value: false,
            },
            rateLimit: {
                type: Number,
            },
            meanMatching: {
                type: Boolean,
                value: false,
            },
            signalExist: {
                type: Boolean,
                value: false,
            },
            signalFreq: {
                type: Number,
            },
            signaltwoExist: {
                type: Boolean,
                value: false,
            },
            signaltwoFreq: {
                type: Number,
            },
            signalthreeExist: {
                type: Boolean,
                value: false,
            },
            myChoiceSeries: {
                type: Array,
                value: () => {
                    return [[0, 0], [Number.EPSILON, 0]];
                }
            },
            otherChoiceSeries: {
                type: Array,
                value: () => {
                    return [[0, 0], [Number.EPSILON, 0]];
                }
            },
            myPayoffSeries: {
                type: Array,
                value: () => {
                    return [[0, 0], [Number.EPSILON, 0]];
                }
            },
            otherPayoffSeries: {
                type: Array,
                value: () => {
                    return [[0, 0], [Number.EPSILON, 0]];
                }
            },
            // set by redwood-period
            _isPeriodRunning: {
                type: Boolean
            },
            _subperiodProgress: {
                type: Number,
                value: 0,
            },
            _myPlannedDecisionString: {
                type: String,
                observer: '_syncMyPlannedDecision',
            },
        }
    }

    ready() {
        super.ready()
        console.log(this.signalExist);
        console.log(this.signaltwoExist);
        console.log(this.signalthreeExist);
        // set payoff indices
        if (this.$.constants.idInGroup === undefined) {
            console.log('Not in game, manually setting payoffIndex');
            this.payoffIndex = 0;
        } else {
            this.payoffIndex = this.$.constants.role == 'row' ? 0 : 1;
        }
        this.otherPayoffIndex = 1 - this.payoffIndex;

        // transpose payoff and probability matrices if player controls vertical line
        if (this.$.constants.role == 'column') {
            // first payoff matrix
            let temp = this.payoffMatrix[1];
            this.payoffMatrix[1] = this.payoffMatrix[2];
            this.payoffMatrix[2] = temp;
        }

        // color schemes for each player's heatmaps
        this.myColor = 'rainbow';
        this.otherColor = 'red';

        // separate each player's payoffs into two separate arrays
        this.myPayoffs = this.payoffMatrix.map(
            val => parseInt(val[this.payoffIndex]));
        this.otherPayoffs = this.payoffMatrix.map(
            val => parseInt(val[this.otherPayoffIndex]));

        this.$.bot.payoffFunction = (myDecision, otherDecision) => {
            const m = this.myPayoffs;
            const row1 = myDecision * m[0] + (1 - myDecision) * m[2];
            const row2 = myDecision * m[1] + (1 - myDecision) * m[3];
            const flowPayoff = otherDecision * row1 + (1 - otherDecision) * row2;
            return flowPayoff;
        };

        if (this.pureStrategy) {
            // if using pure strategy, set bot to only choose pure strategies
            this.$.bot.lambda = 1;
            this.$.bot.pattern = true;

            // only set decision string if we're not doing continuous strategy
            this._myPlannedDecisionString = new String(this.initialDecision);
        }
    }
    _array(a, i) {
        return a[i];
    }
    _payoffMatrixClass(myDecision, otherDecision, i, j) {
        if (myDecision === i && otherDecision === j) {
            return 'blue';
        } else if (myDecision === i || otherDecision === j) {
            return 'light-blue';
        }
        return '';
    }
    _syncMyPlannedDecision() {
        this.myPlannedDecision = parseInt(this._myPlannedDecisionString);
    }
    _onPeriodStart() {
        this._subperiodProgress = 0;
        this.lastT = performance.now();
        this._animID = window.requestAnimationFrame(
            this._updateSubperiodProgress.bind(this));
    }
    _onPeriodEnd() {
        window.cancelAnimationFrame(this._animID);
        this._subperiodProgress = 0;
    }
    _handleGroupDecisionsEvent(event) {
        if(this.numSubperiods > 0){
            if(this.signalExist){
                this.timer += 1;
                if(this.timer == this.signalFreq){
                    this.timer = 0;
                    if(this.shadowRoot.querySelector('#signal').textContent != '@' && this.shadowRoot.querySelector('#signal').textContent != '#'){
                        this.shadowRoot.querySelector('#signal').textContent = '#';
                    }
                    else if(this.shadowRoot.querySelector('#signal').textContent == '@'){
                        this.shadowRoot.querySelector('#signal').textContent = '#';
                    }
                    else this.shadowRoot.querySelector('#signal').textContent = '@';
                }
            }
            if(this.signaltwoExist){
                this.timerTwo += 1;
                if(this.timerTwo == this.signaltwoFreq){
                    this.timerTwo = 0;
                    var snd = new Audio("http://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3");
                    snd.play();
                }
            }
            
        }
    }
    _onGroupDecisionsChanged() {
        this.lastT = performance.now();
        this._subperiodProgress = 0;
    }
    _updateSubperiodProgress(t) {
        const deltaT = (t - this.lastT);
        const secondsPerSubperiod = this.periodLength / this.numSubperiods;
        this._subperiodProgress = 100 * ((deltaT / 1000) / secondsPerSubperiod);
        if(this.numSubperiods == 0){
            if(this.signalExist){
                this.timer += 1;
                if(this.timer >= (this.signalFreq * 37)){
                    this.timer = 0;
                    if(this.shadowRoot.querySelector('#signal').textContent != '@' && this.shadowRoot.querySelector('#signal').textContent != '#'){
                        this.shadowRoot.querySelector('#signal').textContent = '#';
                    }
                    else if(this.shadowRoot.querySelector('#signal').textContent == '@'){
                        this.shadowRoot.querySelector('#signal').textContent = '#';
                    }
                    else this.shadowRoot.querySelector('#signal').textContent = '@';
                }
            }
            if(this.signaltwoExist){
                this.timerTwo += 1;
                if(this.timerTwo == (this.signaltwoFreq * 37)){
                    this.timerTwo = 0;
                    var snd = new Audio("http://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3");
                    snd.play();
                }
            }
        }
        this._animID = window.requestAnimationFrame(
            this._updateSubperiodProgress.bind(this));
    }
    _computeOtherDecision(groupDecisions) {
        // calculate other decision as mean decision of others with opposite role
        // this works for pairwise matching and for mean matching
        let sum_avg_strategy = 0;
        let num_other_players = 0;
        for (let player of this.$.constants.group.players) {
            if (player.role != this.$.constants.role) {
                sum_avg_strategy += groupDecisions[player.participantCode];
                num_other_players++;
            }
        }
        return sum_avg_strategy / num_other_players;
    }
    // return true if thermometer is to be shown
    _showThermometer(pureStrategy, meanMatching) {
        return !pureStrategy || meanMatching;
    }
}

window.customElements.define('leeps-bimatrix', LeepsBimatrix);

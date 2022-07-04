import {html,PolymerElement} from '/static/otree-redwood/node_modules/@polymer/polymer/polymer-element.js';
import '../polymer-elements/iron-flex-layout-classes.js';
import '../polymer-elements/paper-progress.js';
import '../polymer-elements/paper-radio-button.js';
import '../polymer-elements/paper-radio-group.js';
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

<otree-constants id="constants"></otree-constants>
            <div class="layout vertical center">

                <div class="layout vertical end">

                    <div class="layout horizontal">

                        <div id="heatmap-column" class="layout horizontal">

                                <template is="dom-if" if="[[ meanMatching ]]">
                                    <div class="layout vertical">
                                        <h1> My Payoff Matrix</h1>
                                        <discrete-mean-matching-heatmap
                                            class="self-center"
                                            my-decision="[[ myDecision ]]"
                                            other-decision="[[ otherDecision ]]"
                                            size="300"
                                            payoffs="[[ myPayoffs ]]"
                                            color="[[ myColor ]]"
                                            style="margin-right: 20px;">
                                        </discrete-mean-matching-heatmap>
                                    </div>
                                    <div class="layout vertical">
                                        <h1> The counterpart Payoff Matrix</h1>
                                        <discrete-mean-matching-heatmap
                                            class="self-center"
                                            my-decision="[[ myDecision ]]"
                                            other-decision="[[ otherDecision ]]"
                                            size="300"
                                            payoffs="[[ otherPayoffs ]]"
                                            color="[[ otherColor ]]">
                                        </discrete-mean-matching-heatmap>
                                    </div>
                                </template>
                                <template is="dom-if" if="[[ !meanMatching ]]">
                                    <div class="layout vertical">
                                        <h2> My Payoff Matrix</h2>
                                        <div class="layout horizontal">
                                            <table id="payoff-table" class="self-center" style="margin-right: 20px;">
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
                                        </div>
                                    </div>
                                    <!--
                                    <div class="layout vertical">
                                        <h2> The counterpart Payoff Matrix</h2>
                                        <div class="layout horizontal">
                                            <table id="payoff-table" class="self-center">
                                                <tr>
                                                    <td class$="[[ _payoffMatrixClass(myPlannedDecision, otherDecision, 1, 1) ]]">
                                                        <span class="your-payoff">
                                                            [[ _array(otherPayoffs, 0) ]]
                                                        </span>,
                                                        <span class="other-payoff">
                                                            [[ _array(myPayoffs, 0) ]]
                                                        </span>
                                                    </td>
                                                    <td class$="[[ _payoffMatrixClass(myPlannedDecision, otherDecision, 1, 0) ]]">
                                                        <span class="your-payoff">
                                                            [[ _array(otherPayoffs, 1) ]]
                                                        </span>,
                                                        <span class="other-payoff">
                                                            [[ _array(myPayoffs, 1) ]]
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class$="[[ _payoffMatrixClass(myPlannedDecision, otherDecision, 0, 1) ]]">
                                                        <span class="your-payoff">
                                                            [[ _array(otherPayoffs, 2) ]]
                                                        </span>,
                                                        <span class="other-payoff">
                                                            [[ _array(myPayoffs, 2) ]]
                                                        </span>
                                                    </td>
                                                    <td class$="[[ _payoffMatrixClass(myPlannedDecision, otherDecision, 0, 0) ]]">
                                                        <span class="your-payoff">
                                                            [[ _array(otherPayoffs, 3) ]]
                                                        </span>,
                                                        <span class="other-payoff">
                                                            [[ _array(myPayoffs, 3) ]]
                                                        </span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
            -->
                                </template>
                            </template>
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

    // return true if thermometer is to be shown
    _showThermometer(pureStrategy, meanMatching) {
        return !pureStrategy || meanMatching;
    }
}

window.customElements.define('leeps-bimatrix', LeepsBimatrix);

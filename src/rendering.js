import $ from 'jquery';
import Steelseries from './vendor/steelseries';
import Tween from './vendor/tween-min';

export default function link(scope, elem, attrs, ctrl) {
    var data, panel;

    ctrl.events.on('render', function(updateInstance) {
        render(updateInstance);
        ctrl.renderingCompleted();
    });

    function trimThreeLetters(string){
        return string.slice(3)
    }

    function lowerCaseFirstLetter(string){

        var trim = trimThreeLetters(string)

        return (trim.charAt(0).toLowerCase() + trim.slice(1))
    }

    function updateGaugeFunctions() {

        var availableConfigsObjects = ['setFrameDesign', 'setForegroundType','setPointerType','setBackgroundColor','setLcdColor','setLedColor']
        var availableConfigsIntegers = ['setTitleString','setUnitString','setMinValue','setMaxValue', 'setThreshold']

        availableConfigsObjects.forEach(function (functionName) {
            if (panel.gauge[functionName]){
                panel.gauge[functionName](steelseries[trimThreeLetters(functionName)][panel.config[lowerCaseFirstLetter(functionName)]])
            }
        });

        availableConfigsIntegers.forEach(function (functionName) {
            if (panel.gauge[functionName]){
                panel.gauge[functionName](panel.config[lowerCaseFirstLetter(functionName)])
            }
        });

        // ctrl.panel.config.height = ctrl.height
    }

    function updateDimensionType() {
        /* If round type, only apply height, lock width to be 1:1
         * If retangle, allow width and height to be set
         *
         * */

        // todo better varible naming
        var size = ctrl.panel.config.width;
        var lockeddimensions = false

        // if of type round, set width to be equal to height
        if (ctrl.panel.SteelseriesCategories.round.indexOf(ctrl.panel.config.widget) != -1 ){
            size = ctrl.panel.config.height
            lockeddimensions = true
        }

        $('#canvasLinear1').prop({
                width: size,
                height: ctrl.panel.config.height
            });

        ctrl.panel.config.dimensionsEqual = lockeddimensions
    }

    function gaugeTypeCount() {

        switch (ctrl.panel.config.widget) {
            case 'Radial':
            case 'RadialBargraph':
                ctrl.panel.config.gaugeTypeCount = new Array(4);
                break;
            case 'Linear':
                ctrl.panel.config.gaugeTypeCount = new Array(2);
                break;
            default:
                ctrl.panel.config.gaugeTypeCount = new Array(0)
        }

    }

    function updateGaugeValue() {
        panel.gauge.setValueAnimated(data[0].data);
    }

    function createGaugeInstance(){

        panel.gauge = Steelseries[panel.config.widget]('canvasLinear1',{
            gaugeType : Steelseries.GaugeType[panel.config.gaugeType],
            size : ctrl.height,
            height : ctrl.height
        })

        //Dummy object to allow checking of functions
        panel.currentGauge = new steelseries[panel.config.widget]('hiddencanvas');
    }
    
    function render(updateInstance) {

        data = ctrl.data;
        panel = ctrl.panel;

        //detect first draw or widget change??? why first draw working here? todo
        if (updateInstance){
            createGaugeInstance()
        }

        updateGaugeFunctions();

        // updateDimensionType();

        gaugeTypeCount();

        updateGaugeValue();


    }

}
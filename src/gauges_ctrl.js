import {MetricsPanelCtrl} from 'app/plugins/sdk';
import TimeSeries from 'app/core/time_series';
import _ from 'lodash';
import rendering from './rendering';
import Steelseries from './vendor/steelseries';

const panelDefaults = {
    valueName: 'current',
    links: [],
    datasource: null,
    nullPointMode: 'connected',
    steelseriesObj: Steelseries,
    currentGauge: Steelseries,
    config: {
        width: 100,
        height: 100,
        widget: 'Radial',
        dimensionsEqual : true,
        gaugeType: 'TYPE4',
        gaugeTypeCount: new Array(4),
        titleString: '',
        unitString: '',
        minValue: 0,
        maxValue: 100,
        threshold: 50,
        frameDesign: 'BLACK_METAL',
        backgroundColor: 'DARK_GRAY',
        foregroundType: 'TYPE1',
        pointerType: 'TYPE1',
        lcdColor: 'STANDARD',
        ledColor: 'RED_LED'
    },
    //todo obtain from steelseries
    SteelseriesConstants : {
        BackgroundColor: Steelseries.BackgroundColor,
        LcdColor: Steelseries.LcdColor,
        ColorDef: Steelseries.ColorDef,
        LedColor: Steelseries.LedColor,
        GaugeType: Steelseries.GaugeType,
        Orientation: Steelseries.Orientation,
        FrameDesign: Steelseries.FrameDesign,
        PointerType: Steelseries.PointerType,
        ForegroundType: Steelseries.ForegroundType,
        KnobType: Steelseries.KnobType,
        KnobStyle: Steelseries.KnobStyle,
        LabelNumberFormat: Steelseries.LabelNumberFormat,
        TickLabelOrientation: Steelseries.TickLabelOrientation,
        TrendState: Steelseries.TrendState
    },
    SteelseriesCategories : {
        round : ['Radial', 'RadialBargraph', 'RadialVertical', 'Level', 'Compass', 'WindDirection', 'Horizon', 'Clock', 'Altimeter']
    }
}

// todo load in steelseries var using lodash defaults function

export class SteelseriesGaugesCtrl extends MetricsPanelCtrl {

    constructor($scope, $injector) {
        super($scope, $injector);

        _.defaults(this.panel, panelDefaults);

        this.events.on('render', this.onRender.bind(this));
        this.events.on('data-received', this.onDataReceived.bind(this));
        this.events.on('data-error', this.onDataError.bind(this));
        this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));

    }

    onInitEditMode() {
        this.addEditorTab('Options', 'public/plugins/steelseries-gauges-panel/editor.html', 2);
    }

    onDataError() {
        this.series = [];
        this.render();
    }

    parseSeries(series) {
        return _.map(this.series, (serie, i) => {
                return {
                    label: serie.alias,
                    data: serie.stats[this.panel.valueName]
                };
    });
    }

    onDataReceived(dataList) {
        this.series = dataList.map(this.seriesHandler.bind(this));
        this.data = this.parseSeries(this.series);
        this.render(this.data);
    }

    seriesHandler(seriesData) {
        var series = new TimeSeries({
            datapoints: seriesData.datapoints,
            alias: seriesData.target,
        });
        series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
        return series;
    }

    onRender() {
        this.data = this.parseSeries(this.series);
    }

    link(scope, elem, attrs, ctrl) {
        rendering(scope, elem, attrs, ctrl);
    }
    
}

SteelseriesGaugesCtrl.templateUrl = 'module.html';


const ControlKit = require("controlkit")

export default class ControlKitUi {

    controlKit = ControlKit;
    props: object;

    constructor(props: object) {

        this.props = props;
        this.controlKit = new ControlKit();

        this.controlKit
            .addPanel({label: 'Start pack', align: 'left'})
                .addGroup()
                    .addSubGroup()
                    .addCheckbox(this.props, 'pokaDot')
                    .addCheckbox(this.props, 'stripes')
                    .addCheckbox(this.props, 'louisV')
                    .addCheckbox(this.props, 'eggInEgg')
        this.controlKit
            .addPanel({label: 'Settings', align: 'right'})
                .addGroup()
                    .addSubGroup()
                    .addCheckbox(this.props, 'matte')
                    .addCheckbox(this.props, 'animate')
                    .addCheckbox(this.props, 'animateLights')
                    .addColor(this.props,'color',{colorMode:'rgb'})
                    .addColor(this.props, 'color2', {colorMode: 'rgb'})
                    .addColor(this.props,'color3',{colorMode:'rgb'})
                    .addColor(this.props, 'color4', {colorMode: 'rgb'})


        document.body.appendChild(
            document.getElementById('controlKit')
        );

    }

}
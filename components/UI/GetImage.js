import React from 'react';
import { Icon } from 'expo';
import {
    Image,
    Dimensions
} from 'react-native';
import { getData } from '../../components/services/baseService';
const { width } = Dimensions.get("window");
const columnWidth = (width - 10) / 2 - 10;


export class GetImage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key: props.data,
            img: null
        };
    };


    componentWillMount() {
        //console.log("this.state.key: ", this.state.key);
        if (this.state.key != "") {
            getData('thumbs/' + this.state.key)
                .then((img) => {
                    //console.log("img: ", img);
                    this.setState({ img: img });
                });
        } else {
            this.setState({ img: null });
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ key: nextProps.key });

    }
    render() {
        const img = this.state.img;
        console.log(img);
        
                if (img != null) {
                    return (<Image source={{ uri: img.url }} {...this.props} style={[this.props.style], { height: columnWidth / img.file.width * img.file.height}} />);
                } else {
                    return (<Image source={require('../../assets/images/console-icon.png')} resizeMode={'center'} style={{ width: '100%', height: columnWidth }} />);
        }

    }
}
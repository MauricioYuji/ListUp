import React from 'react';
import { Icon } from 'expo';
import {
    Image
} from 'react-native';
import { getData } from '../../components/services/Service';


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
        getData('thumbs/' + this.state.key)
            .then((img) => {
                //console.log("img: ", img);
                this.setState({ img: img });
            });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ key: nextProps.key });
        
    }
    render() {
        const img = this.state.img;
        if (img != null) {
            //console.log(img.url);
            return (
                <Image source={{ uri: img.url }} {...this.props} style={[this.props.style]} />
            );
        } else {
            return null;
        }

    }
}
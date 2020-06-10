import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import {WithStyles} from "@material-ui/core";

import styles from "./InputLoader.styles";

interface InputsLoaderProps extends WithStyles<typeof styles>{
    loading: boolean;
}

class InputsLoader extends React.PureComponent<InputsLoaderProps>{
    render() {
        const {loading, classes} = this.props;

        return <div className={classes.loaderWrap}>
            {this.props.children}
            {loading && <CircularProgress className={classes.loader} size={30}/>}
        </div>;
    }
}

export default withStyles(styles)(InputsLoader);
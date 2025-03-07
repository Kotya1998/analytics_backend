import React from 'react';
import {shallowEqual} from "recompose";
import get from "lodash/get";
import classNames from "classnames";

import {EducationalStandardCreateModalProps} from './types';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import withStyles from '@material-ui/core/styles/withStyles';
import DatePickerComponent from "../../../components/DatePicker";

import {EducationalStandardFields} from '../enum';

import connect from './CreateModal.connect';
import styles from './CreateModal.styles';
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {YEAR_DATE_FORMAT} from "../../../common/utils";

class CreateModal extends React.PureComponent<EducationalStandardCreateModalProps> {
    state = {
        educationalStandard: {
            [EducationalStandardFields.ID]: null,
            [EducationalStandardFields.TITLE]: '',
            [EducationalStandardFields.YEAR]: '2022',
        },
    };

    componentDidUpdate(prevProps: Readonly<EducationalStandardCreateModalProps>, prevState: Readonly<{}>, snapshot?: any) {
        const {educationalStandard} = this.props;

        if (!shallowEqual(educationalStandard, prevProps.educationalStandard)){
            this.setState({
                educationalStandard: {
                    [EducationalStandardFields.ID]: get(educationalStandard, EducationalStandardFields.ID),
                    [EducationalStandardFields.TITLE]: get(educationalStandard, EducationalStandardFields.TITLE, ''),
                    [EducationalStandardFields.YEAR]: get(educationalStandard, EducationalStandardFields.YEAR, '2022'),
                }
            });
        }
    }

    handleClose = () => {
        this.props.actions.closeDialog();
    }

    handleSave = () => {
        const {educationalStandard} = this.state;

        if (educationalStandard[EducationalStandardFields.ID]){
            this.props.actions.changeEducationalStandard(educationalStandard);
        } else {
            this.props.actions.createNewEducationalStandard(educationalStandard);
        }
    }

    saveField = (field: string) => (e: React.ChangeEvent) => {
        const {educationalStandard} = this.state;

        this.setState({
            educationalStandard: {
                ...educationalStandard,
                [field]: get(e, 'target.value')
            }
        })
    }

    changeYear = (value: MaterialUiPickersDate) => {
        const {educationalStandard} = this.state;

        this.setState({
            educationalStandard: {
                ...educationalStandard,
                [EducationalStandardFields.YEAR]: value ? value.format(YEAR_DATE_FORMAT) : ''
            }
        })
    }

    render() {
        const {isOpen, classes} = this.props;
        const {educationalStandard} = this.state;

        const disableButton = educationalStandard[EducationalStandardFields.TITLE]?.length === 0

        const isEditMode = Boolean(educationalStandard[EducationalStandardFields.ID]);

        return (
            <Dialog
                open={isOpen}
                onClose={this.handleClose}
                classes={{
                    paper: classes.dialog
                }}
            >
                <DialogTitle> {isEditMode ? 'Редактировать' : 'Создать'} образовательный стандарт </DialogTitle>
                <DialogContent>
                    <TextField label="Название образовательного стандарта *"
                               onChange={this.saveField(EducationalStandardFields.TITLE)}
                               variant="outlined"
                               className={classNames(classes.input, classes.marginBottom30)}
                               fullWidth
                               value={educationalStandard[EducationalStandardFields.TITLE]}
                               InputLabelProps={{
                                   shrink: true,
                               }}
                    />
                    <DatePickerComponent
                      label="Год *"
                      views={["year"]}
                      value={educationalStandard[EducationalStandardFields.YEAR]}
                      onChange={this.changeYear}
                      format={YEAR_DATE_FORMAT}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose}
                            variant="text">
                        Отмена
                    </Button>
                    <Button onClick={this.handleSave}
                            variant="contained"
                            disabled={disableButton}
                            color="primary"
                    >
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

// @ts-ignore
export default withStyles(styles)(connect(CreateModal));

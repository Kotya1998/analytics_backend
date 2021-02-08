import React, {SyntheticEvent} from 'react';
import Scrollbars from "react-custom-scrollbars";
import get from 'lodash/get';

import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import withStyles from '@material-ui/core/styles/withStyles';
import TableBody from "@material-ui/core/TableBody";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/EditOutlined";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";

import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import SortingButton from "../../components/SortingButton";
import Search from "../../components/Search";
import {SortingType} from "../../components/SortingButton/types";

import {DirectionFields} from "../Direction/enum";
import {DirectionType} from "../Direction/types";

import {TrainingModulesProps, TrainingModuleType} from './types';
import {TrainingModuleFields} from "./enum";
import TrainingModuleCreateModal from "./TrainingModuleCreateModal";

import connect from './TrainingModules.connect';
import styles from './TrainingModules.styles';

class TrainingModules extends React.Component<TrainingModulesProps> {
    state = {
        anchorsEl: {},
        deleteConfirmId: null
    }

    componentDidMount() {
        this.props.actions.getTrainingModulesList();
    }

    handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        this.props.actions.changeCurrentPage(page + 1);
        this.props.actions.getTrainingModulesList();
    }

    changeSorting = (field: string) => (mode: SortingType)=> {
        this.props.actions.changeSorting({field: mode === '' ? '' : field, mode});
        this.props.actions.getTrainingModulesList();
    }

    handleChangeSearchQuery = (search: string) => {
        this.props.actions.changeSearchQuery(search);
        this.props.actions.changeCurrentPage(1);
        this.props.actions.getTrainingModulesList();
    }

    handleMenu = (id: number) => (event: SyntheticEvent): void => {
        this.setState({
            anchorsEl: {
                [id]: event.currentTarget
            }
        });
    };

    handleCloseMenu = () => {
        this.setState({anchorsEl: {}});
    };

    handleConfirmDeleteDialog = () => {
        this.props.actions.deleteTrainingModule(this.state.deleteConfirmId);

        this.closeConfirmDeleteDialog();
    }

    closeConfirmDeleteDialog = () => {
        this.setState({
            deleteConfirmId: null
        });
    }

    handleClickDelete = (id: number) => () => {
        this.setState({
            deleteConfirmId: id
        });
    }

    handleClickEdit = (trainingModule: TrainingModuleType) => () => {
        this.props.actions.openDialog({data: trainingModule});
    }

    handleClickCreate = () => {
        this.props.actions.openDialog({data: {}});
    }

    render() {
        const {classes, trainingModules, allCount, currentPage, sortingField, sortingMode, canEdit} = this.props;
        const {deleteConfirmId} = this.state;

        return (
            <Paper className={classes.root}>
                <div className={classes.titleWrap}>
                    <Typography className={classes.title}> Учебные модули </Typography>

                    <Search handleChangeSearchQuery={this.handleChangeSearchQuery}/>
                </div>

                <Scrollbars>
                    <div className={classes.tableWrap}>
                        <Table stickyHeader size='small'>
                            <TableHead className={classes.header}>
                                <TableRow>
                                    <TableCell>
                                        Название
                                        <SortingButton changeMode={this.changeSorting(TrainingModuleFields.NAME)}
                                                       mode={sortingField === TrainingModuleFields.NAME ? sortingMode : ''}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        Описание
                                        <SortingButton changeMode={this.changeSorting(TrainingModuleFields.DESCRIPTION)}
                                                       mode={sortingField === TrainingModuleFields.DESCRIPTION ? sortingMode : ''}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        Направленность ОП (УП)
                                    </TableCell>
                                    <TableCell>
                                        Направления подготовки
                                    </TableCell>

                                    {canEdit && <TableCell />}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {trainingModules.map((trainingModule: TrainingModuleType) => {
                                    const profile = get(trainingModule, [TrainingModuleFields.DISCIPLINE, TrainingModuleFields.ACADEMIC_PLAN, TrainingModuleFields.EDUCATIONAL_PROFILE], '');
                                    const plans = get(trainingModule, [TrainingModuleFields.DISCIPLINE, TrainingModuleFields.ACADEMIC_PLAN, TrainingModuleFields.ACADEMIC_PLAN_IN_FIELD_OF_STUDY], []);

                                    return (
                                        <TableRow key={trainingModule[TrainingModuleFields.ID]}>
                                            <TableCell>
                                                {trainingModule[TrainingModuleFields.NAME]}
                                            </TableCell>
                                            <TableCell>
                                                {trainingModule[TrainingModuleFields.DESCRIPTION]}
                                            </TableCell>
                                            <TableCell>
                                                {profile}
                                            </TableCell>
                                            <TableCell>
                                                {/*
                                                // @ts-ignore*/}
                                                {plans.map((item: {[TrainingModuleFields.FIELD_OF_STUDY]: DirectionType}) =>
                                                    <>{item[TrainingModuleFields.FIELD_OF_STUDY][DirectionFields.NUMBER]} {item[TrainingModuleFields.FIELD_OF_STUDY][DirectionFields.FACULTY]}</>
                                                )}
                                            </TableCell>
                                            {canEdit &&
                                                <TableCell className={classes.actions}>
                                                    <IconButton
                                                        onClick={this.handleClickDelete(trainingModule[TrainingModuleFields.ID])}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                    <IconButton onClick={this.handleClickEdit(trainingModule)}>
                                                        <EditIcon/>
                                                    </IconButton>
                                                </TableCell>
                                            }
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </Scrollbars>


                <div className={classes.footer}>
                    <TablePagination count={allCount}
                                     component="div"
                                     page={currentPage - 1}
                                     rowsPerPageOptions={[]}
                                     onChangePage={this.handleChangePage}
                                     rowsPerPage={10}
                                     onChangeRowsPerPage={()=>{}}
                    />
                    {canEdit &&
                        <Fab color="secondary"
                             classes={{
                                 root: classes.addIcon
                             }}
                             onClick={this.handleClickCreate}
                        >
                            <AddIcon/>
                        </Fab>
                    }
                </div>

                {canEdit &&
                    <>
                        <ConfirmDialog onConfirm={this.handleConfirmDeleteDialog}
                                       onDismiss={this.closeConfirmDeleteDialog}
                                       confirmText={'Вы точно уверены, что хотите удалить учебный модуль?'}
                                       isOpen={Boolean(deleteConfirmId)}
                                       dialogTitle={'Удалить учебнуй модуль'}
                                       confirmButtonText={'Удалить'}
                        />

                        <TrainingModuleCreateModal/>
                    </>
                }
            </Paper>
        );
    }
}

export default connect(withStyles(styles)(TrainingModules));

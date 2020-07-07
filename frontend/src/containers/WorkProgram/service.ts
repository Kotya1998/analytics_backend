import {ReactText} from "react";
import get from 'lodash/get';
import BaseService from "../../service/base-service";
import {Section, Topic} from "./types";
import {EvaluationToolFields, PrerequisiteFields, ResultsFields, workProgramTopicFields} from "./enum";
import {CourseFields} from "../Courses/enum";
import {TrainingEntitiesFields} from "../TrainingEntities/enum";

class WorkProgramService extends BaseService{
    getWorkProgram(id: string){
        return this.get(`/api/workprogram/detail/${id}`);
    }

    getWorkProgramEvaluationTools(id: string){
        return this.get(`/api/toolsinworkprogram/${id}`);
    }

    saveWorkProgram(destination: string, value: string, id: string){
        const formData = new FormData();

        formData.append(destination, value);

        return this.patch(`/api/workprogram/update/${id}`, formData);
    }

    saveSection(section: Section){
        const formData = new FormData();

        Object.keys(section).forEach((key: string) => {
            if (key !== 'topics' && key !== 'evaluation_tools'){
                // @ts-ignore
                if (section[key]){
                    // @ts-ignore
                    formData.append(key, section[key]);
                }
            }
        })


        return this.patch(`/api/sections/${section.id}`, formData);
    }

    createNewSection(section: Section, workProgramId: ReactText){
        const formData = new FormData();

        Object.keys(section).forEach((key: string) => {
            // @ts-ignore
            formData.append(key, section[key]);
        })

        // @ts-ignore
        formData.append('work_program', workProgramId);

        return this.post(`/api/sections/`, formData);
    }

    changeSectionNumber(newNumber: ReactText, sectionId: ReactText){
        const formData = new FormData();

        // @ts-ignore
        formData.append('new_ordinal_number', newNumber);
        // @ts-ignore
        formData.append('descipline_section', sectionId);

        return this.post(`/api/sections/NewOrdinalNumbers`, formData);
    }

    deleteSection(id: ReactText){
        return this.delete(`/api/sections/${id}`);
    }

    changePrerequisites(prerequisite: any, workProgramId: ReactText){
        const formData = new FormData();
        const id = prerequisite[PrerequisiteFields.ID];

        // @ts-ignore
        formData.append('workprogram', workProgramId);

        formData.append(PrerequisiteFields.MASTER_LEVEL, prerequisite[PrerequisiteFields.MASTER_LEVEL]);
        formData.append(PrerequisiteFields.ITEM, prerequisite[PrerequisiteFields.ITEM][TrainingEntitiesFields.ID]);

        return this.patch(`/api/prerequisitesofworkprogram/update/${id}`, formData);
    }

    saveTopic(topic: Topic){
        const formData = new FormData();

        formData.append(workProgramTopicFields.DESCRIPTION, topic[workProgramTopicFields.DESCRIPTION]);
        formData.append(workProgramTopicFields.SECTION, topic[workProgramTopicFields.SECTION]);
        formData.append(workProgramTopicFields.NUMBER, topic[workProgramTopicFields.NUMBER]);

        if (topic[workProgramTopicFields.COURSE]){
            // @ts-ignore
            formData.append(workProgramTopicFields.COURSE, topic[workProgramTopicFields.COURSE][CourseFields.ID]);
        }

        Object.keys(topic).forEach((key: string) => {
            // @ts-ignore
            if (topic[key]){
                // @ts-ignore
            }
        })

        return this.patch(`/api/topics/${topic[workProgramTopicFields.ID]}`, formData);
    }

    createNewTopic(topic: Topic, workProgramId: ReactText){
        const formData = new FormData();

        Object.keys(topic).forEach((key: string) => {
            // @ts-ignore
            formData.append(key, topic[key]);
        })

        // @ts-ignore
        formData.append('work_program', workProgramId);

        return this.post(`/api/topics/create`, formData);
    }

    addPrerequisites(prerequisite: any, workProgramId: ReactText){
        const formData = new FormData();

        // @ts-ignore
        formData.append('workprogram', workProgramId);

        formData.append(PrerequisiteFields.MASTER_LEVEL, prerequisite[PrerequisiteFields.MASTER_LEVEL]);
        formData.append(PrerequisiteFields.ITEM, prerequisite[PrerequisiteFields.ITEM][TrainingEntitiesFields.ID]);

        return this.post(`/api/prerequisitesofworkprogram/create`, formData);
    }

    addEvaluationTool(evaluationTool: any){
        return this.post(`/api/tools/`, evaluationTool);
    }

    addResult(result: any, workProgramId: ReactText){
        return this.post(`/api/outcomesofworkprogram/create`, {
            ...result,
            workprogram: workProgramId,
            item: get(result, [ResultsFields.ITEM, TrainingEntitiesFields.ID])
        });
    }

    changeEvaluationTool(evaluationTool: any){
        const id = evaluationTool[EvaluationToolFields.ID];

        return this.patch(`/api/tools/${id}`, evaluationTool);
    }

    changeResult(result: any){
        const id = result[ResultsFields.ID];

        return this.patch(`/api/outcomesofworkprogram/update/${id}`, {
            ...result,
            item: get(result, [ResultsFields.ITEM, TrainingEntitiesFields.ID])
        });
    }

    changeTopicNumber(newNumber: ReactText, topicId: ReactText){
        const formData = new FormData();

        // @ts-ignore
        formData.append('new_ordinal_number', newNumber);
        // @ts-ignore
        formData.append('topic', topicId);

        return this.post(`/api/topics/NewOrdinalNumbers`, formData);
    }

    deleteTopic(id: ReactText){
        return this.delete(`/api/topics/${id}`);
    }

    deletePrerequisite(id: ReactText){
        return this.delete(`/api/prerequisitesofworkprogram/delete/${id}`);
    }

    deleteEvaluationTool(id: ReactText){
        return this.delete(`/api/tools/${id}`);
    }

    deleteResult(id: ReactText){
        return this.delete(`/api/outcomesofworkprogram/delete/${id}`);
    }

    updateLiterature(literature: Array<number>, workProgramId: ReactText){
        return this.patch(`/api/workprogram/update/${workProgramId}`, {
            bibliographic_reference: literature
        });
    }
}

export default WorkProgramService;
from rest_framework import serializers, viewsets

from .models import WorkProgram, Indicator, Competence, OutcomesOfWorkProgram, DisciplineSection, Topic, EvaluationTool,\
    PrerequisitesOfWorkProgram, Certification, OnlineCourse, BibliographicReference, FieldOfStudy, \
    ImplementationAcademicPlan, AcademicPlan

from dataprocessing.serializers import ItemSerializer


class IndicatorSerializer(serializers.ModelSerializer):
    """Сериализатор Индикаторов"""
    class Meta:
        model = Indicator
        fields = ['id','number', 'name', 'competence']


class CompetenceSerializer(serializers.ModelSerializer):
    """Сериализатор Компетенций"""
    class Meta:
        model = Competence
        fields = ['id','number', 'name']


class IndicatorListSerializer(serializers.ModelSerializer):
    competence = CompetenceSerializer()

    class Meta:
        model = Indicator
        fields = ['id','number', 'name', 'competence']


class AcademicPlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = AcademicPlan
        fields = "__all__"


class ImplementationAcademicPlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = ImplementationAcademicPlan
        fields = "__all__"


class OutcomesOfWorkProgramSerializer(serializers.ModelSerializer):
    """Сериализатор работы с результатом обучения"""
    item  = ItemSerializer()
    class Meta:
        model = OutcomesOfWorkProgram
        fields = ['item', 'workprogram', 'masterylevel']


class OutcomesOfWorkProgramCreateSerializer(serializers.ModelSerializer):
    """Сериализатор создания результата обучения"""
    class Meta:
        model = OutcomesOfWorkProgram
        fields = ['item', 'workprogram', 'masterylevel', 'evaluation_tool']


class EvaluationToolSerializer(serializers.ModelSerializer):
    """Сериализатор ФОСов"""
    class Meta:
        model = EvaluationTool
        fields = "__all__"


class EvaluationToolForOutcomsSerializer(serializers.ModelSerializer):
    """Сериализатор ФОСов"""
    class Meta:
        model = EvaluationTool
        fields = ['id', 'type', 'name']


class OutcomesOfWorkProgramInWorkProgramSerializer(serializers.ModelSerializer):
    """Сериализатор вывода результата обучения для вывода результата в рабочей программе"""
    # item_name  = serializers.ReadOnlyField(source='item.name')
    # item_id  = serializers.ReadOnlyField(source='item.id')
    item  = ItemSerializer()
    evaluation_tool = EvaluationToolForOutcomsSerializer(many=True)

    class Meta:
        model = OutcomesOfWorkProgram
        fields = ['id', 'item', 'masterylevel', 'evaluation_tool']


class PrerequisitesOfWorkProgramCreateSerializer(serializers.ModelSerializer):
    """Сериализатор создания пререквизита обучения"""
    class Meta:
        model = PrerequisitesOfWorkProgram
        fields = ['item', 'workprogram', 'masterylevel']


class PrerequisitesOfWorkProgramSerializer(serializers.ModelSerializer):
    """Сериализатор создания пререквизита обучения"""
    item  = ItemSerializer()
    class Meta:
        model = PrerequisitesOfWorkProgram
        fields = ['id', 'item', 'workprogram', 'masterylevel']


class PrerequisitesOfWorkProgramInWorkProgramSerializer(serializers.ModelSerializer):
    """Сериализатор вывода пререквизита обучения для вывода пререквизита в рабочей программе"""
    # item_name  = serializers.ReadOnlyField(source='item.name')
    # item_id  = serializers.ReadOnlyField(source='item.id')
    item  = ItemSerializer()
    class Meta:
        model = PrerequisitesOfWorkProgram
        fields = ['id', 'item', 'masterylevel']


class OnlineCourseSerializer(serializers.ModelSerializer):
    """Сериализатор онлайн курсов"""

    class Meta:
        model = OnlineCourse
        fields = "__all__"


class TopicSerializer(serializers.ModelSerializer):
    """Сериализатор Тем"""
    url_online_course = OnlineCourseSerializer(required=False)
    class Meta:
        model = Topic
        fields = ['id', 'discipline_section', 'number', 'description', 'url_online_course']


class TopicCreateSerializer(serializers.ModelSerializer):
    """Сериализатор Тем"""
    class Meta:
        model = Topic
        fields = ['id', 'discipline_section', 'number', 'description', 'url_online_course']
        extra_kwargs = {
            'number': {'required': False}
        }


class SectionSerializer(serializers.ModelSerializer):
    """Сериализатор Разделов"""

    class Meta:
        model = DisciplineSection
        fields = "__all__"


class BibliographicReferenceSerializer(serializers.ModelSerializer):
    """Сериализатор Разделов"""

    class Meta:
        model = BibliographicReference
        fields = "__all__"


class DisciplineSectionSerializer(serializers.ModelSerializer):
    """Сериализатор Разделов"""
    topics = TopicSerializer(many = True)
    evaluation_tools = EvaluationToolSerializer(many = True)
    class Meta:
        model = DisciplineSection
        fields = ['id', 'ordinal_number', 'name', 'topics', 'evaluation_tools', 'contact_work', 'lecture_classes', 'laboratory', 'practical_lessons', 'SRO', 'total_hours']


class CertificationSerializer(serializers.ModelSerializer):
    """Сериализатор аттестации"""

    class Meta:
        model = Certification
        fields = "__all__"


class WorkProgramSerializer(serializers.ModelSerializer):
    """Сериализатор рабочих программ"""
    #prerequisites = serializers.StringRelatedField(many=True)
    prerequisites = PrerequisitesOfWorkProgramInWorkProgramSerializer(source='prerequisitesofworkprogram_set', many=True)
    # outcomes = serializers.StringRelatedField(many=True)
    outcomes = OutcomesOfWorkProgramInWorkProgramSerializer(source='outcomesofworkprogram_set', many=True)
    #discipline_sections = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name')
    discipline_sections = DisciplineSectionSerializer(many = True)
    discipline_certification = CertificationSerializer(many = True)
    bibliographic_reference = BibliographicReferenceSerializer(many = True)


    class Meta:
        model = WorkProgram
        fields = ['discipline_code', 'qualification', 'prerequisites', 'outcomes', 'title', 'hoursFirstSemester', 'hoursSecondSemester', 'discipline_sections','discipline_certification', 'bibliographic_reference']

    def create(self, validated_data):
        """
        Create and return a new `Snippet` instance, given the validated data.
        """
        return WorkProgram.objects.create(**validated_data)

class WorkProgramCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания рабочих программ"""

    class Meta:
        model = WorkProgram
        fields = ['discipline_code', 'qualification', 'title', 'hoursFirstSemester', 'hoursSecondSemester', 'bibliographic_reference']


class BibliographicReferenceForWorkProgramSerializer(serializers.ModelSerializer):
    """Сериализатор Разделов"""

    class Meta:
        model = BibliographicReference
        fields = ['id']


class Geeks(object):
    def __init__(self, dictonary):
        self.dict = bibliographic_references


class WorkProgramBibliographicReferenceUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания рабочих программ"""
    #bibliographic_reference = BibliographicReferenceForWorkProgramSerializer(many=True, read_only=False)
    #bibliographic_reference = serializers.PrimaryKeyRelatedField(many=True, read_only=False, queryset=BibliographicReference.objects.all())
    # bibliographic_references = serializers.DictField(
    #     child = serializers.CharField())
    # , source='bibrefs_set'
    #bibrefs = BibliographicReferenceForWorkProgramSerializer(many=True, read_only=True)

    class Meta:
        model = WorkProgram
        fields = ['bibliographic_reference']
    #
    # def update(self, instance, validated_data):
    #     tags_data = validated_data.pop('bibliographic_references')
    #     print (validated_data('bibliographic_references'))
    #     for tag_data in tags_data:
    #         print(tags_data)
        #print (tags_data[0])
    #     instance = super(WorkProgramBibliographicReferenceUpdateSerializer, self).update(instance, validated_data)
    #
    #     for tag_data in tags_data:
    #         tag_qs = BibliographicReference.objects.filter(name__iexact=tag_data['bibliographic_reference'])
    #
    #         if tag_qs.exists():
    #             tag = tag_qs.first()
    #         else:
    #             tag = BibliographicReferenceSerializer.objects.create(**tag_data)
    #
    #         instance.bibliographic_reference.add(tag)
    #
    #     return instance

class DisciplineSectionForEvaluationToolsSerializer(serializers.ModelSerializer):
    """Сериализатор Разделов для оценочных средств"""
    class Meta:
        model = DisciplineSection
        fields = ['id', 'ordinal_number', 'name']


class FieldOfStudySerializer(serializers.ModelSerializer):
    """
        Сериализатор образовательных программ (направлений)
    """
    class Meta:
        model = FieldOfStudy
        fields = "__all__"

        
class EvaluationToolForWorkProgramSerializer(serializers.ModelSerializer):
    """Сериализатор ФОСов"""
    #descipline_sections = serializers.StringRelatedField(many=True, source='evaluation_tools')
    descipline_sections = DisciplineSectionForEvaluationToolsSerializer(many=True, source='evaluation_tools')

    class Meta:
        model = EvaluationTool
        fields = ['id', 'type', 'name', 'description', 'check_point', 'deadline', 'min', 'max', 'descipline_sections']


class EvaluationToolCreateSerializer(serializers.ModelSerializer):
    """Сериализатор ФОСов"""
    descipline_sections = serializers.PrimaryKeyRelatedField(many=True, source='evaluation_tools', queryset=DisciplineSection.objects.all())
    #descipline_sections = DisciplineSectionForEvaluationToolsSerializer(many=True, source='evaluation_tools')

    class Meta:
        model = EvaluationTool
        fields = ['type', 'name', 'description', 'check_point', 'deadline', 'min', 'max', 'descipline_sections']







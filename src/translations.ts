/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = "ru" | "chm" | "sah" | "en";

export interface TranslationStrings {
  title: string;
  subtitle: string;
  heroTitle: string;
  heroSubtitle: string;
  clientApp: string;
  guestMode: string;
  loginRegister: string;
  userLabel: string;
  logoutLabel: string;
  interactiveWheel: string;
  interactiveWheelDesc: string;
  savePng: string;
  downloadPdf: string;
  averageLabel: string;
  outOfTen: string;
  comparisonWith: string;
  prevMeasurement: string;
  wheelTitleLabel: string;
  wheelTitlePlaceholder: string;
  templateHeader: string;
  templateClassic: string;
  templateBusiness: string;
  templateFreelance: string;
  addCustomLabel: string;
  addCustomPlaceholder: string;
  addButton: string;
  editCriteriaHeader: string;
  clearAll: string;
  emptyListWarning: string;
  notesPlaceholder: string;
  saveWheelButton: string;
  guestWarningInEditor: string;
  howToReadHeader: string;
  zoneCritical: string;
  zoneCriticalDesc: string;
  zoneRoutine: string;
  zoneRoutineDesc: string;
  zoneComfort: string;
  zoneComfortDesc: string;
  zonePeak: string;
  zonePeakDesc: string;
  coachTipHeader: string;
  coachTipDesc: string;
  historyHeader: string;
  historyDesc: string;
  historyEmptyTitle: string;
  historyEmptyDesc: string;
  avgScoreLabel: string;
  compareBtn: string;
  openBtn: string;
  spheresCount: string;
  footerCopy1: string;
  footerCopy2: string;
  toastSaved: string;
  toastDeleted: string;
  toastLoaded: string;
  historyChartTitle: string;

  // New translations: Auth
  authTitleLogin: string;
  authTitleRegister: string;
  authDescLogin: string;
  authDescRegister: string;
  authUsernameLabel: string;
  authUsernamePlaceholder: string;
  authPasswordLabel: string;
  authPasswordPlaceholder: string;
  authLoginBtn: string;
  authRegisterBtn: string;
  authNoAccount: string;
  authHaveAccount: string;
  authRegisterLink: string;
  authLoginLink: string;
  authOr: string;
  authContinueGuest: string;
  authGuestWarning: string;
  authEmptyFieldsErr: string;
  authNotFoundErr: string;
  authWrongPassErr: string;
  authSuccessLogin: string;
  authExistsErr: string;
  authSuccessRegister: string;

  // New translations: Themes
  themeLabel: string;
  themeDark: string;
  themeLight: string;

  // New translations: Color settings
  colorSettingsHeader: string;
  colorModeLabel: string;
  colorModePalette: string;
  colorModeScores: string;
  colorCustomizerHeader: string;
  colorResetBtn: string;
  colorModeDesc: string;
  colorActivePaletteLabel: string;
  careerPlanTitle: string;
  careerPlanDesc: string;
  careerPlanEmpty: string;
  careerPlanSetTarget: string;
  careerPlanAutoGen: string;
  careerPlanStepsHeader: string;
  careerPlanSummaryHeader: string;
  careerPlanMatrixTitle: string;
  careerPlanNoSteps: string;
  careerPlanStepsActive: string;
  careerPlanAdviceHeader: string;
  careerPlanAdviceText: string;
  careerPlanSavePngBtn: string;
  strategyGrowth: string;
  strategyOptimization: string;
  strategyMaintain: string;
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  ru: {
    title: "Карьерный Компас",
    subtitle: "Колесо карьерного баланса • Интерактивный аудит карьеры",
    heroTitle: "Оцените баланс вашей профессиональной жизни",
    heroSubtitle: "Создайте индивидуальное карьерное колесо, выставите оценки от 1 до 10 для ключевых сфер, составьте план действий и скачайте готовый PDF-отчет.",
    clientApp: "100% клиентское веб-приложение",
    guestMode: "⚠️ Режим гостя",
    loginRegister: "Войти / Регистрация",
    userLabel: "Пользователь",
    logoutLabel: "Выйти",
    interactiveWheel: "Интерактивное Колесо",
    interactiveWheelDesc: "Нажмите на сегмент колеса, чтобы изменить оценку критерия",
    savePng: "Сохранить PNG",
    downloadPdf: "Скачать PDF отчет",
    averageLabel: "Средний",
    outOfTen: "из 10 баллов",
    comparisonWith: "Показано сравнение с",
    prevMeasurement: "Предыдущим замером",
    wheelTitleLabel: "Название колеса (замера)",
    wheelTitlePlaceholder: "Например: Текущий замер 2026",
    templateHeader: "Выбрать готовый шаблон критериев",
    templateClassic: "Классическая карьера",
    templateBusiness: "Для Бизнеса / Стартапов",
    templateFreelance: "Для Фрилансеров",
    addCustomLabel: "Добавить свой критерий",
    addCustomPlaceholder: "Например: Стрессоустойчивость",
    addButton: "Добавить",
    editCriteriaHeader: "Редактирование критериев",
    clearAll: "Очистить все",
    emptyListWarning: "Список пуст. Выберите шаблон выше или добавьте свои сферы деятельности!",
    notesPlaceholder: "Заметки: Что мешает достичь 10 баллов? Какие шаги планируете предпринять?",
    saveWheelButton: "Сохранить колесо в историю",
    guestWarningInEditor: "⚠️ Вы не авторизованы. Сохраненное колесо останется только на текущем компьютере. Зарегистрируйтесь, чтобы иметь постоянный доступ к истории!",
    howToReadHeader: "Как читать ваши результаты?",
    zoneCritical: "1 - 3 балла (Критическая зона)",
    zoneCriticalDesc: "Сфера сильно запущена или вызывает стресс. Требуются срочные изменения и переоценка подхода к работе в этой области.",
    zoneRoutine: "4 - 6 баллов (Зона рутины)",
    zoneRoutineDesc: "Посредственные показатели. Стабильно, но нет драйва, развития или удовлетворения. Легко переходит в выгорание.",
    zoneComfort: "7 - 8 баллов (Зона комфорта)",
    zoneComfortDesc: "Отличный уровень! Активный рост, высокая вовлеченность. Вы контролируете эту сферу и получаете хорошие результаты.",
    zonePeak: "9 - 10 баллов (Пик лидерства)",
    zonePeakDesc: "Идеальный баланс. Максимальная удовлетворенность. Данный критерий является вашей сильнейшей опорой и ресурсом.",
    coachTipHeader: "Совет коуча:",
    coachTipDesc: "Колесо катится плавно, когда оно круглое. Идеально сбалансированное колесо на уровне 7-8 баллов во всех сферах принесет больше удовлетворения, чем скачки от 10 в работе до 2 в балансе работы и отдыха. Постарайтесь выровнять \"впадины\".",
    historyHeader: "История замеров",
    historyDesc: "Загружайте предыдущие результаты или накладывайте их для сравнения",
    historyEmptyTitle: "История замеров пуста",
    historyEmptyDesc: "Сохраните свои замеры с помощью кнопки в редакторе, чтобы они появились здесь для сравнения и анализа!",
    avgScoreLabel: "ср. балл",
    compareBtn: "Сравнить",
    openBtn: "Открыть",
    spheresCount: "сфер",
    footerCopy1: "© 2026 Карьерный Компас (Колесо Карьерного Баланса). Все права защищены.",
    footerCopy2: "Приложение работает локально на вашем устройстве, обеспечивая 100% приватность данных.",
    toastSaved: "Замер сохранен в историю!",
    toastDeleted: "Замер удален из истории",
    toastLoaded: "Замер успешно загружен",
    historyChartTitle: "Динамика карьерного баланса (Ср. балл)",

    // New translations: Auth
    authTitleLogin: "Вход в приложение",
    authTitleRegister: "Регистрация",
    authDescLogin: "Войдите, чтобы сохранять и сравнивать свои карьерные колеса",
    authDescRegister: "Создайте аккаунт, чтобы отслеживать свой карьерный рост",
    authUsernameLabel: "Имя пользователя",
    authUsernamePlaceholder: "Иван Иванов",
    authPasswordLabel: "Пароль",
    authPasswordPlaceholder: "••••••••",
    authLoginBtn: "Войти",
    authRegisterBtn: "Зарегистрироваться",
    authNoAccount: "Еще нет аккаунта?",
    authHaveAccount: "Уже есть аккаунт?",
    authRegisterLink: "Зарегистрируйтесь",
    authLoginLink: "Войдите",
    authOr: "Или",
    authContinueGuest: "Продолжить без регистрации (Гость)",
    authGuestWarning: "В режиме гостя данные сохраняются в текущей сессии вашего браузера",
    authEmptyFieldsErr: "Пожалуйста, заполните все поля.",
    authNotFoundErr: "Пользователь с таким именем не найден.",
    authWrongPassErr: "Неверный пароль.",
    authSuccessLogin: "Успешный вход! Загрузка...",
    authExistsErr: "Пользователь с таким именем уже зарегистрирован.",
    authSuccessRegister: "Регистрация успешна! Вход...",

    // New translations: Themes
    themeLabel: "Тема",
    themeDark: "Темная",
    themeLight: "Светлая",

    // New translations: Color settings
    colorSettingsHeader: "Цветовые настройки колеса",
    colorModeLabel: "Режим окраски колеса:",
    colorModePalette: "По критериям (Палитра)",
    colorModeScores: "По оценкам (Бальная система)",
    colorCustomizerHeader: "Настройка цветов по баллам:",
    colorResetBtn: "Сбросить цвета",
    colorModeDesc: "В режиме бальной системы цвет сегментов меняется в зависимости от поставленной оценки (1-3, 4-6, 7-8, 9-10). Вы можете настроить эти цвета ниже.",
    colorActivePaletteLabel: "Редактировать цвета",
    careerPlanTitle: "Индивидуальный план развития карьерных критериев",
    careerPlanDesc: "Установите целевые показатели, распишите конкретные шаги и используйте автогенератор профессиональных рекомендаций.",
    careerPlanEmpty: "Пожалуйста, добавьте карьерные сферы в редакторе выше, чтобы построить план развития!",
    careerPlanSetTarget: "Выставить целевой балл (1-10)",
    careerPlanAutoGen: "Сгенерировать шаги",
    careerPlanStepsHeader: "Пошаговый план развития сферы",
    careerPlanSummaryHeader: "Сводная таблица целей развития",
    careerPlanMatrixTitle: "Матрица целей развития",
    careerPlanNoSteps: "Шаги не прописаны",
    careerPlanStepsActive: "шагов заполнено",
    careerPlanAdviceHeader: "Совет карьерного консультанта",
    careerPlanAdviceText: "Для получения готовых рекомендаций нажмите кнопку «Сгенерировать шаги» в любой сфере, а затем отрегулируйте их под свою реальность. При выгрузке отчета ваши цели и шаги будут полностью учтены!",
    careerPlanSavePngBtn: "Сохранить PNG План",
    strategyGrowth: "РОСТ",
    strategyOptimization: "ОПТИМИЗАЦИЯ",
    strategyMaintain: "ПОДДЕРЖАНИЕ",
  },
  chm: {
    title: "Карьер компас",
    subtitle: "Карьер баланс орва • Интерактив карьер аудит",
    heroTitle: "Паша илышын балансым висыза",
    heroSubtitle: "Шоке карьер орвам чоҥыза, тӱҥ шорт-влаклан 1 гыч 10 марте баллым шындалыза, паша планым возыза да ямдылык PDF-отчетым налыза.",
    clientApp: "100% клиент веб-аппликаций",
    guestMode: "⚠️ Уна режим",
    loginRegister: "Пураш / Регистраций",
    userLabel: "Пайдаланыше",
    logoutLabel: "Лекташ",
    interactiveWheel: "Интерактив орва",
    interactiveWheelDesc: "Критерийын баллым вашталташ манын, орва сегментыш темдалза",
    savePng: "PNG-ш аралаш",
    downloadPdf: "PDF отчетым налаш",
    averageLabel: "Кыдалаш",
    outOfTen: "10 балл гыч",
    comparisonWith: "Таҥастарымаш ончыкталтын:",
    prevMeasurement: "Ончычсо висымаш дене",
    wheelTitleLabel: "Орван лӱмжӧ (висымаш)",
    wheelTitlePlaceholder: "Мутлан: Кызытсе висымаш 2026",
    templateHeader: "Ямдылык критерий шаблон-влакым ойыраш",
    templateClassic: "Классик карьер",
    templateBusiness: "Бизнес / Стартаплан",
    templateFreelance: "Фрилансерлан",
    addCustomLabel: "Шоке критерийым ушнаш",
    addCustomPlaceholder: "Мутлан: Чытымашлык",
    addButton: "Ушнаш",
    editCriteriaHeader: "Критерий-влакым тӧрлатымаш",
    clearAll: "Чыла эрыкташ",
    emptyListWarning: "Список яра. Кӱшнӧ шаблон-влакым ойырыза але шоке паша сфер-влакым ушныза!",
    notesPlaceholder: "Пале-влак: Модлан кӧра 10 балл огыл? Могай ошкыл-влакым ышташ палемдыза?",
    saveWheelButton: "Орвам историйыш аралаш",
    guestWarningInEditor: "⚠️ Тый авторизацийым эртышын огытыл. Аралыме орва тиде компьютерыште гына кодеш. Историйлан эре лекташ манын, регистрацийым эртыза!",
    howToReadHeader: "Результат-влакым кузе лудаш?",
    zoneCritical: "1 - 3 балл (Критикан лоп)",
    zoneCriticalDesc: "Паша сфера пеш кодыныл але стрессым луктеш. Вашке вашталтымаш да паша подходым уэш висымаш кӱлеш.",
    zoneRoutine: "4 - 6 балл (Рутинын лоп)",
    zoneRoutineDesc: "Кыдалаш куат. Стабильно, но драйв уке, вияҥмаш уке. Сае выгоранийыш савырна.",
    zoneComfort: "7 - 8 балл (Йӧнан лоп)",
    zoneComfortDesc: "Тӱҥ сае уровень! Вияҥмаш, кугу пашаш ушнымаш. Тый тиде сфер-влакым виседат да сае результатым налат.",
    zonePeak: "9 - 10 балл (Лидерствын кӱкшыт)",
    zonePeakDesc: "Идеал баланс. Эн кугу куанмаш. Тиде критерий тыйын эн кугу негыз да ресурс лиеш.",
    coachTipHeader: "Коучын каҥаш:",
    coachTipDesc: "Орва йӧнын кая, кунам тудо йыргешке. Чыла сферлаште 7-8 баллаш идеально сбалансированный орва эн кугу куан ышта, пашаште 10-ан гыч канышыште 2-ан марте тӧрштылмо деч. Колалатым лап куатлатым тӧрлаташ тыршыза.",
    historyHeader: "Висымаш историй",
    historyDesc: "Ончычсо результат-влакым налыза але таҥастараш наложитлыза",
    historyEmptyTitle: "Висымаш историй яра",
    historyEmptyDesc: "Редакторыште кнопко дене шоке замер-влакым аралыза, нуно тиде верыште таҥастараш да анализлан лектыт!",
    avgScoreLabel: "кыдалаш балл",
    compareBtn: "Таҥастараш",
    openBtn: "Почаш",
    spheresCount: "сфер",
    footerCopy1: "© 2026 Карьер компас (Карьер баланс орва). Чыла правам аралыме.",
    footerCopy2: "Аппликаций тыйын устройствышто локально пашам ышта, 100% приватностьым пуа.",
    toastSaved: "Висымаш историйыш аралыме!",
    toastDeleted: "Висымашым историй гыч кораш лие",
    toastLoaded: "Висымаш вераҥдыме",
    historyChartTitle: "Карьер баланс динамика (Кыдалаш балл)",

    // New translations: Auth
    authTitleLogin: "Приложенийыш пураш",
    authTitleRegister: "Регистраций",
    authDescLogin: "Шоке карьер орва-влакым аралаш да таҥастараш манын, пурыза",
    authDescRegister: "Карьер кушмашым эскераш манын, аккаунтым чоҥыза",
    authUsernameLabel: "Пайдаланышын лӱмжӧ",
    authUsernamePlaceholder: "Иван Иванов",
    authPasswordLabel: "Пароль",
    authPasswordPlaceholder: "••••••••",
    authLoginBtn: "Пураш",
    authRegisterBtn: "Регистрацийым эртыза",
    authNoAccount: "Аккаунт эше уке?",
    authHaveAccount: "Аккаунт кучылталтеш?",
    authRegisterLink: "Регистрацийым эртыза",
    authLoginLink: "Пурыза",
    authOr: "Але",
    authContinueGuest: "Регистраций деч посна шуяш (Уна)",
    authGuestWarning: "Уна режимыште данный-влак браузер сессийыште аралалтыт",
    authEmptyFieldsErr: "Пожалуйста, чыла пасу-влакым темыза.",
    authNotFoundErr: "Тыгай лӱман пайдаланыше огыл муалт.",
    authWrongPassErr: "Йоҥылыш пароль.",
    authSuccessLogin: "Сайын пурымо! Загрузко...",
    authExistsErr: "Тыгай лӱман пайдаланыше кучылталтеш.",
    authSuccessRegister: "Регистраций сайын эртен! Пураш...",

    // New translations: Themes
    themeLabel: "Тема",
    themeDark: "Шем тема",
    themeLight: "Волгыдо тема",

    // New translations: Color settings
    colorSettingsHeader: "Орван тӱс тӧрлатымаш",
    colorModeLabel: "Орван тӱс режимже:",
    colorModePalette: "Критерий дене (Тӱс тӱшка)",
    colorModeScores: "Балл дене (Балл системе)",
    colorCustomizerHeader: "Балл тӱс-влакым тӧрлатымаш:",
    colorResetBtn: "Тӱс-влакым шулыкаш",
    colorModeDesc: "Балл системе режимыште сегмент тӱс шындалыме балл дене вашталтеш (1-3, 4-6, 7-8, 9-10). Тый тиде тӱс-влакым кӱшнӧ тӧрлатен кертат.",
    colorActivePaletteLabel: "Тӱс-влакым тӧрлатымаш",
    careerPlanTitle: "Ик карьер кушмо план",
    careerPlanDesc: "Целевой баллым шындалыза, ошкыл-влакым возыза да автогенератор каҥашым кучылтза.",
    careerPlanEmpty: "Пожалуйста, кӱшнӧ шаблон-влакым ойырыза але паша сфер-влакым ушныза, кушмо планым возаш манын!",
    careerPlanSetTarget: "Целевой баллым шындаш (1-10)",
    careerPlanAutoGen: "Ошкыл-влакым возаш",
    careerPlanStepsHeader: "Сферым вияҥдыме ошкыл-влак",
    careerPlanSummaryHeader: "Кушмо нерген таблице",
    careerPlanMatrixTitle: "Вияҥмаш цель матрице",
    careerPlanNoSteps: "Ошкыл-влак возымо огытыл",
    careerPlanStepsActive: "ошкыл темыме",
    careerPlanAdviceHeader: "Карьер консультант каҥаш",
    careerPlanAdviceText: "Ямдылык каҥашым налаш манын, «Ошкыл-влакым возаш» кнопкалан темдалза, а вара шоке илыш дене тӧрлатыза. Экспорт годым чыла палемдымаш-влак аралалтыт!",
    careerPlanSavePngBtn: "План PNG аралаш",
    strategyGrowth: "ВИЯҤМАШ",
    strategyOptimization: "ТӦРЛАТЫМАШ",
    strategyMaintain: "КУЧЫМАШ",
  },
  sah: {
    title: "Карьера компаһа",
    subtitle: "Карьера тэҥнэһигин эргимтэтэ • Үлэ суолун интерактивнай аудита",
    heroTitle: "Идэтийбит олоххут тэҥнэһигин сыаналааҥ",
    heroSubtitle: "Ураты карьера эргимтэтин оҥоруҥ, сүрүн хайысхаларга 1-тэн 10-ҥа дылы сыанабыл туруоруҥ, былаан оҥостуҥ уонна бэлэм PDF-отчуоту хачайдааҥ.",
    clientApp: "100% клиент веб-сыһыарыыта",
    guestMode: "⚠️ Ыалдьыт режима",
    loginRegister: "Кирии / Регистрация",
    userLabel: "Кыттааччы",
    logoutLabel: "Тахсыы",
    interactiveWheel: "Интерактивнай эргимтэ",
    interactiveWheelDesc: "Сыанабылы уларытарга эргимтэ аҥарыгар баттааҥ",
    savePng: "PNG хараалат",
    downloadPdf: "PDF отчуоту хачайдаа",
    averageLabel: "Орто сыана",
    outOfTen: "10 баалтан",
    comparisonWith: "Тэҥнээһин көрдөрүлүннэ:",
    prevMeasurement: "Ааспыт сыанабылы кытта",
    wheelTitleLabel: "Эргимтэ аата (сыанабыл)",
    wheelTitlePlaceholder: "Холобур: Карьера 2026",
    templateHeader: "Бэлэм халыыбы талыы",
    templateClassic: "Классическай карьера",
    templateBusiness: "Бизнес / Стартап",
    templateFreelance: "Фрилансердарга",
    addCustomLabel: "Бэйэ сыанабылын эппиэйдиир хайысханы эбүү",
    addCustomPlaceholder: "Холобур: Стресска тулуурдаах буолуу",
    addButton: "Эбүү",
    editCriteriaHeader: "Хайысхалары уларытыы",
    clearAll: "Барытын сотуу",
    emptyListWarning: "Тиһиликтэр суохтар. Үөһээ халыып талыҥ эбэтэр бэйэҕит хайысхаларгытын эбиҥ!",
    notesPlaceholder: "Бэлиэтээһиннэр: Туох мэһэйдиир 10 баалга тиийэргэ? Туох хардыылары оҥорор былааннааххыт?",
    saveWheelButton: "Эргимтэни устуоруйаҕа хараал",
    guestWarningInEditor: "⚠️ Эһиги киирэ иликкит. Харааллыбыт эргимтэ тиһигэ бу эрэ көмпүүтэргэ хаалыаҕа. Устуоруйаҕа куруук киирэр туһугар бэлиэтэниҥ!",
    howToReadHeader: "Түмүктэри хайдах өйдүүбүт?",
    zoneCritical: "1 - 3 баал (Критическай балаһыанньа)",
    zoneCriticalDesc: "Хайысха олох уларыйбыт эбэтэр стреһы таһаарар. Сурдөөх уларытыылар уонна сыанабыллар ирдэниллэллэр.",
    zoneRoutine: "4 - 6 баал (Рутина балаһыанньата)",
    zoneRoutineDesc: "Орто көрдөрүүлэр. Күннээҕи үлэ, сайдыы уонна астыныы суох. Сүрэх хараатыытыгар тиэрдиэн сөп.",
    zoneComfort: "7 - 8 баал (Комфорт балаһыанньата)",
    zoneComfortDesc: "Олус үчүгэй таһым! Активнай сайдыы, үлэҕэ кыттыы. Эһиги бу хайысханы салайаҕыт уонна үчүгэй түмүктэри ылаҕыт.",
    zonePeak: "9 - 10 баал (Лидерство үрдүк таһыма)",
    zonePeakDesc: "Эҥкил суох тэҥнэһик. Муҥур астыныы. Бу хайысха эһиги тирэх уонна сүрүн күүс буолар.",
    coachTipHeader: "Коуч субэтин:",
    coachTipDesc: "Эргимтэ төгүрүк буоллаҕына эрэ үчүгэйдик эргийэр. Бары хайысхаларга 7-8 бааллаах тэҥнэһиктээх эргимтэ ордук астыныыны аҕалар, үлэҕэ 10 баалтан уонна сынньалаҥҥа 2 баалтан ордук. Намыһах сыанабыллары үрдэтэргэ тыршыҥ.",
    historyHeader: "Сыанабыллар устуоруйалара",
    historyDesc: "Ааспыт сыанабыллары устуоруйаттан угуҥ уонна тэҥнээн көрүҥ",
    historyEmptyTitle: "Сыанабыл устуоруйата суох",
    historyEmptyDesc: "Сыанабылгытын устуоруйаҕа хараалыҥ, оччоҕо тэҥнээн көрөргө бу манна көстүөхтэрэ!",
    avgScoreLabel: "орто баал",
    compareBtn: "Тэҥнээһин",
    openBtn: "Арый",
    spheresCount: "хайысха",
    footerCopy1: "© 2026 Карьера компаһа (Карьера эргимтэтэ). Бары быраап көмүскэнэр.",
    footerCopy2: "Сыһыарыы эһиги тэрилгитигэр локальнайдык үлэлиир, 100% кистэлэҥи хааччыйар.",
    toastSaved: "Сыанабыл устуоруйаҕа харааллыбыт!",
    toastDeleted: "Сыанабыл устуоруйаттан сотулунна",
    toastLoaded: "Сыанабыл ситиһиилээхтик угулунна",
    historyChartTitle: "Карьера тэҥнэһигин динамиката (Орто баал)",

    // New translations: Auth
    authTitleLogin: "Сыһыарыыга киирии",
    authTitleRegister: "Регистрация",
    authDescLogin: "Карьера эргимтэтин уурарга уонна тэҥнииргэ киириҥ",
    authDescRegister: "Карьераҥ үрдүүрүн кэтииргэ аккаунт оҥоһун",
    authUsernameLabel: "Кыттааччы аата",
    authUsernamePlaceholder: "Иван Иванов",
    authPasswordLabel: "Пароль",
    authPasswordPlaceholder: "••••••••",
    authLoginBtn: "Киирии",
    authRegisterBtn: "Регистрацияланыы",
    authNoAccount: "Аккаунт суох дуо?",
    authHaveAccount: "Аккаунт баар дуо?",
    authRegisterLink: "Регистрациялан",
    authLoginLink: "Киир",
    authOr: "Эбэтэр",
    authContinueGuest: "Регистрация суох салҕаа (Ыалдьыт)",
    authGuestWarning: "Ыалдьыт быһыытынан киирдэххэ сибидиэнньэлэр браузергар эрэ ууруллаллар",
    authEmptyFieldsErr: "Бары сирдэри толоруҥ.",
    authNotFoundErr: "Маннык ааттаах кыттааччы суох.",
    authWrongPassErr: "Сыыһа пароль.",
    authSuccessLogin: "Киирии ситиһиилээх! Хачайдааһын...",
    authExistsErr: "Маннык ааттаах кыттааччы баар.",
    authSuccessRegister: "Регистрация ситиһиилээх! Киирии...",

    // New translations: Themes
    themeLabel: "Тема",
    themeDark: "Хараҥа",
    themeLight: "Сырдык",

    // New translations: Color settings
    colorSettingsHeader: "Эргимтэ өҥүн туруоруута",
    colorModeLabel: "Эргимтэ өҥнүүр режима:",
    colorModePalette: "Хайысхаларынан (Палитра)",
    colorModeScores: "Сыанабылынан (Баал систиэмэтэ)",
    colorCustomizerHeader: "Баал өҥнөрүн туруоруу:",
    colorResetBtn: "Өҥнөрүн сордоноо",
    colorModeDesc: "Баал систиэмэтин режима эргимтэ аҥардарын өҥө туруоруллубут сыанабылтан уларыйар (1-3, 4-6, 7-8, 9-10). Бу өҥнөрү аллара уларытыаххын сөп.",
    colorActivePaletteLabel: "Өҥнөрүн уларытыы",
    careerPlanTitle: "Карьера сайдыытын былаана",
    careerPlanDesc: "Сыал буолбут бааллары туруоруҥ, хаамыылары суруйуҥ уонна коуч субэтин автогенераторын туһаныҥ.",
    careerPlanEmpty: "Былааны оҥорорго үөһээ баар редакторга карьера хайысхаларын эбиҥ!",
    careerPlanSetTarget: "Сыал баалы туруоруу (1-10)",
    careerPlanAutoGen: "Хаамыылары оҥор",
    careerPlanStepsHeader: "Хайысханы сайыннарар хаамыылар",
    careerPlanSummaryHeader: "Былаан түмүк таблицата",
    careerPlanMatrixTitle: "Былаан сыалын матрицата",
    careerPlanNoSteps: "Хаамыылар сурулла иликтэр",
    careerPlanStepsActive: "хаамыы толорулунна",
    careerPlanAdviceHeader: "Карьера консультанын субэтэ",
    careerPlanAdviceText: "Бэлэм субэлэри ыларга «Хаамыылары оҥор» кнопкани баттааҥ, онтон бэйэҕит олоххутугар сөп түбэһиннэриҥ. Экспорттаатахха былаан барыта киириэҕэ!",
    careerPlanSavePngBtn: "Былаан PNG уур",
    strategyGrowth: "САЙДЫЫ",
    strategyOptimization: "УЛАРЫТЫЫ",
    strategyMaintain: "ТИРЭХТЭЭХ",
  },
  en: {
    title: "Career Compass",
    subtitle: "Career Balance Wheel • Interactive Career Audit",
    heroTitle: "Assess the Balance of Your Professional Life",
    heroSubtitle: "Create an individual career wheel, rate key areas from 1 to 10, draft an action plan, and download a ready PDF report.",
    clientApp: "100% Client-Side Web App",
    guestMode: "⚠️ Guest Mode",
    loginRegister: "Login / Register",
    userLabel: "User",
    logoutLabel: "Log Out",
    interactiveWheel: "Interactive Wheel",
    interactiveWheelDesc: "Click on a wheel segment to change the criterion score",
    savePng: "Save PNG",
    downloadPdf: "Download PDF Report",
    averageLabel: "Average",
    outOfTen: "out of 10 points",
    comparisonWith: "Showing comparison with",
    prevMeasurement: "Previous measurement",
    wheelTitleLabel: "Wheel (assessment) Title",
    wheelTitlePlaceholder: "e.g., Current Assessment 2026",
    templateHeader: "Choose ready template criteria",
    templateClassic: "Classic Career",
    templateBusiness: "For Business / Startups",
    templateFreelance: "For Freelancers",
    addCustomLabel: "Add custom criterion",
    addCustomPlaceholder: "e.g., Stress tolerance",
    addButton: "Add",
    editCriteriaHeader: "Edit Criteria",
    clearAll: "Clear All",
    emptyListWarning: "The list is empty. Choose a template above or add your own career areas!",
    notesPlaceholder: "Notes: What prevents reaching 10 points? What steps do you plan to take?",
    saveWheelButton: "Save wheel to history",
    guestWarningInEditor: "⚠️ You are not logged in. Saved wheels will remain only on this computer. Register to have permanent history access!",
    howToReadHeader: "How to read your results?",
    zoneCritical: "1 - 3 points (Critical zone)",
    zoneCriticalDesc: "The area is heavily neglected or causes stress. Urgent changes and re-evaluation of your approach are required.",
    zoneRoutine: "4 - 6 points (Routine zone)",
    zoneRoutineDesc: "Mediocre indicators. Stable, but no drive, growth, or satisfaction. Easily transitions into burnout.",
    zoneComfort: "7 - 8 points (Comfort zone)",
    zoneComfortDesc: "Excellent level! Active growth, high engagement. You control this area and get good results.",
    zonePeak: "9 - 10 points (Leadership peak)",
    zonePeakDesc: "Ideal balance. Maximum satisfaction. This criterion is your strongest pillar and resource.",
    coachTipHeader: "Coach's Tip:",
    coachTipDesc: "A wheel rolls smoothly when it is round. A perfectly balanced wheel at 7-8 points across all areas brings more satisfaction than spikes of 10 in work and 2 in work-life balance. Try to level out the gaps.",
    historyHeader: "Assessment History",
    historyDesc: "Load previous results or overlay them for comparison",
    historyEmptyTitle: "History is empty",
    historyEmptyDesc: "Save your measurements using the button in the editor to make them appear here for comparison and analysis!",
    avgScoreLabel: "avg. score",
    compareBtn: "Compare",
    openBtn: "Open",
    spheresCount: "spheres",
    footerCopy1: "© 2026 Career Compass (Career Balance Wheel). All rights reserved.",
    footerCopy2: "The application works locally on your device, ensuring 100% data privacy.",
    toastSaved: "Assessment saved to history!",
    toastDeleted: "Assessment removed from history",
    toastLoaded: "Assessment loaded successfully",
    historyChartTitle: "Career Balance Dynamics (Avg. Score)",

    // New translations: Auth
    authTitleLogin: "Sign In",
    authTitleRegister: "Register",
    authDescLogin: "Log in to save and compare your career balance wheels",
    authDescRegister: "Create an account to track your professional growth",
    authUsernameLabel: "Username",
    authUsernamePlaceholder: "John Doe",
    authPasswordLabel: "Password",
    authPasswordPlaceholder: "••••••••",
    authLoginBtn: "Sign In",
    authRegisterBtn: "Create Account",
    authNoAccount: "Don't have an account?",
    authHaveAccount: "Already have an account?",
    authRegisterLink: "Register now",
    authLoginLink: "Sign in",
    authOr: "Or",
    authContinueGuest: "Continue as Guest (No Registration)",
    authGuestWarning: "In Guest mode, your assessments are stored locally in this browser.",
    authEmptyFieldsErr: "Please fill in all fields.",
    authNotFoundErr: "User with this username was not found.",
    authWrongPassErr: "Incorrect password.",
    authSuccessLogin: "Sign in successful! Loading...",
    authExistsErr: "Username is already taken.",
    authSuccessRegister: "Registration successful! Signing in...",

    // New translations: Themes
    themeLabel: "Theme",
    themeDark: "Dark",
    themeLight: "Light",

    // New translations: Color settings
    colorSettingsHeader: "Wheel Color Settings",
    colorModeLabel: "Wheel Coloring Mode:",
    colorModePalette: "By Criteria (Palette)",
    colorModeScores: "By Score Value (Scoring Zones)",
    colorCustomizerHeader: "Scoring Zone Colors:",
    colorResetBtn: "Reset Colors",
    colorModeDesc: "In 'By Score Value' mode, segment colors reflect their current rating (1-3, 4-6, 7-8, 9-10). You can customize these colors below.",
    colorActivePaletteLabel: "Customize Colors",
    careerPlanTitle: "Individual Career Development Plan",
    careerPlanDesc: "Define target scores, build action steps, and auto-generate recommendations based on coaching methodology.",
    careerPlanEmpty: "Please add career spheres in the editor above to build a development plan!",
    careerPlanSetTarget: "Set Target Level (1-10)",
    careerPlanAutoGen: "Auto-Generate Plan",
    careerPlanStepsHeader: "Action Steps for Achievement",
    careerPlanSummaryHeader: "Summary Plan Overview",
    careerPlanMatrixTitle: "Active Targets Matrix",
    careerPlanNoSteps: "No steps yet",
    careerPlanStepsActive: "steps active",
    careerPlanAdviceHeader: "Coaching Advice",
    careerPlanAdviceText: "Click the button in any card to auto-generate standard coaching recommendations, then adjust them dynamically under your current reality. When exporting PDF or PNG, your career plans will be elegantly rendered.",
    careerPlanSavePngBtn: "Save Plan PNG",
    strategyGrowth: "GROWTH",
    strategyOptimization: "OPTIMIZE",
    strategyMaintain: "MAINTAIN",
  }
};

export const TEMPLATES_BY_LANG: Record<Language, {
  standard: { name: string; score: number; notes: string }[];
  business: { name: string; score: number; notes: string }[];
  freelance: { name: string; score: number; notes: string }[];
}> = {
  ru: {
    standard: [
      { name: "Профессиональный рост", score: 5, notes: "" },
      { name: "Заработная плата и бонусы", score: 5, notes: "" },
      { name: "Баланс работы и жизни", score: 5, notes: "" },
      { name: "Отношения с коллегами", score: 5, notes: "" },
      { name: "Интерес к задачам", score: 5, notes: "" },
      { name: "Условия труда", score: 5, notes: "" },
      { name: "Признание руководства", score: 5, notes: "" },
      { name: "Обучение и развитие", score: 5, notes: "" },
    ],
    business: [
      { name: "Прибыль компании", score: 5, notes: "" },
      { name: "Продажи и маркетинг", score: 5, notes: "" },
      { name: "Автоматизация процессов", score: 5, notes: "" },
      { name: "Сила и мотивация команды", score: 5, notes: "" },
      { name: "Конкурентоспособность продукта", score: 5, notes: "" },
      { name: "Стратегическое видение", score: 5, notes: "" },
      { name: "Узнаваемость бренда", score: 5, notes: "" },
      { name: "Удовлетворенность клиентов", score: 5, notes: "" },
    ],
    freelance: [
      { name: "Стабильный поток доходов", score: 5, notes: "" },
      { name: "Личный бренд в сети", score: 5, notes: "" },
      { name: "Качество портфолио", score: 5, notes: "" },
      { name: "Уровень и щедрость клиентов", score: 5, notes: "" },
      { name: "Гибкость и свобода графика", score: 5, notes: "" },
      { name: "Личная самодисциплина", score: 5, notes: "" },
      { name: "Комфорт рабочего места", score: 5, notes: "" },
      { name: "Нетворкинг и связи", score: 5, notes: "" },
    ]
  },
  chm: {
    standard: [
      { name: "Профессионал кушмаш", score: 5, notes: "" },
      { name: "Пашадар да бонус-влак", score: 5, notes: "" },
      { name: "Паша да илыш баланс", score: 5, notes: "" },
      { name: "Коллега-влак дене кыл", score: 5, notes: "" },
      { name: "Паша ышташ интерес", score: 5, notes: "" },
      { name: "Паша вер йӧн", score: 5, notes: "" },
      { name: "Вуйлатышын палымаш", score: 5, notes: "" },
      { name: "Тунеммаш да вияҥмаш", score: 5, notes: "" },
    ],
    business: [
      { name: "Компания табыш", score: 5, notes: "" },
      { name: "Ужалымаш да маркетинг", score: 5, notes: "" },
      { name: "Процесс-влак автоматизаций", score: 5, notes: "" },
      { name: "Команда куат да мотиваций", score: 5, notes: "" },
      { name: "Продукт конкурентность", score: 5, notes: "" },
      { name: "Стратегий ончалаш", score: 5, notes: "" },
      { name: "Бренд палымаш", score: 5, notes: "" },
      { name: "Клиент-влак куан", score: 5, notes: "" },
    ],
    freelance: [
      { name: "Стабиль табыш йӧн", score: 5, notes: "" },
      { name: "Сетьыште личный бренд", score: 5, notes: "" },
      { name: "Портфолио качество", score: 5, notes: "" },
      { name: "Клиент-влакын куат да суапланымаш", score: 5, notes: "" },
      { name: "Куштылго да эрык график", score: 5, notes: "" },
      { name: "Личный самодисциплина", score: 5, notes: "" },
      { name: "Паша вер комфорт", score: 5, notes: "" },
      { name: "Нетворкинг да кыл-влак", score: 5, notes: "" },
    ]
  },
  sah: {
    standard: [
      { name: "Идэтийбит таһым үрдээһинэ", score: 5, notes: "" },
      { name: "Үлэ хамнаһа уонна бонустар", score: 5, notes: "" },
      { name: "Үлэ уонна олох тэҥнэһигэ", score: 5, notes: "" },
      { name: "Үлэһиттэри кытта сыһыан", score: 5, notes: "" },
      { name: "Үлэ интэриэһэ", score: 5, notes: "" },
      { name: "Үлэ усулуобуйата", score: 5, notes: "" },
      { name: "Салайааччы билиитин ылыы", score: 5, notes: "" },
      { name: "Үөрэх уонна сайдыы", score: 5, notes: "" },
    ],
    business: [
      { name: "Тэрилтэ барыһа", score: 5, notes: "" },
      { name: "Атыы-эргиэн уонна маркетинг", score: 5, notes: "" },
      { name: "Үлэ хаамыытын автоматизациялааһын", score: 5, notes: "" },
      { name: "Хамаанда күүһэ уонна мотивацията", score: 5, notes: "" },
      { name: "Продукт күрэстэһэр кыаҕа", score: 5, notes: "" },
      { name: "Стратегическай көрүү", score: 5, notes: "" },
      { name: "Бренд биллэр буолуута", score: 5, notes: "" },
      { name: "Клиент астыныыта", score: 5, notes: "" },
    ],
    freelance: [
      { name: "Сыанабыл киириитин тиһигэ", score: 5, notes: "" },
      { name: "Бэйэ брендин ситимҥэ тарҕатыы", score: 5, notes: "" },
      { name: "Портфолио хаачыстыбата", score: 5, notes: "" },
      { name: "Клиент таһыма уонна үтүө санаата", score: 5, notes: "" },
      { name: "Үлэ кэмин көҥүл талыы", score: 5, notes: "" },
      { name: "Бэйэ дисциплината", score: 5, notes: "" },
      { name: "Үлэлиир сир үчүгэй усулуобуйата", score: 5, notes: "" },
      { name: "Нетворкинг уонна ситимнэр", score: 5, notes: "" },
    ]
  },
  en: {
    standard: [
      { name: "Professional Growth", score: 5, notes: "" },
      { name: "Salary and Bonuses", score: 5, notes: "" },
      { name: "Work-Life Balance", score: 5, notes: "" },
      { name: "Relations with Colleagues", score: 5, notes: "" },
      { name: "Interest in Tasks", score: 5, notes: "" },
      { name: "Working Conditions", score: 5, notes: "" },
      { name: "Management Recognition", score: 5, notes: "" },
      { name: "Training and Development", score: 5, notes: "" },
    ],
    business: [
      { name: "Company Profit", score: 5, notes: "" },
      { name: "Sales and Marketing", score: 5, notes: "" },
      { name: "Process Automation", score: 5, notes: "" },
      { name: "Team Strength & Motivation", score: 5, notes: "" },
      { name: "Product Competitiveness", score: 5, notes: "" },
      { name: "Strategic Vision", score: 5, notes: "" },
      { name: "Brand Awareness", score: 5, notes: "" },
      { name: "Customer Satisfaction", score: 5, notes: "" },
    ],
    freelance: [
      { name: "Stable Income Stream", score: 5, notes: "" },
      { name: "Personal Brand Online", score: 5, notes: "" },
      { name: "Portfolio Quality", score: 5, notes: "" },
      { name: "Client Quality & Generosity", score: 5, notes: "" },
      { name: "Schedule Flexibility & Freedom", score: 5, notes: "" },
      { name: "Personal Self-Discipline", score: 5, notes: "" },
      { name: "Workplace Comfort", score: 5, notes: "" },
      { name: "Networking and Connections", score: 5, notes: "" },
    ]
  }
};

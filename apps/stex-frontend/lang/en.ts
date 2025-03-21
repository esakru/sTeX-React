export const en = {
  home: {
    header: 'VoLL-KI based Courses at FAU',
    couseSection: 'Current semester (WS 22/23)',
    otherCourses: 'Other Courses',
    guidedTourHeader: 'Topic-Based, Free Style Learning',
    footerInfo:
      "Active course materials incorporate learning support services based on a model that is updated with every interaction with the materials. Such models of a user's preferences and competencies contain highly sensitive personal data. Therefore the learning support services (and corresponding user model data collection) are only enabled when the user is logged in via the FAU Single-Signon Service and are kept secure and under exclusive control of the respective user in the Voll-KI Trust Zone.",
    expIconHover1: "See what's brewing in our laboratory.",
    expIconHover2: 'Exercise Extreme Caution!',
    cardIntro:
      '"Flash Cards" support reviewing and drilling the concepts of the' +
      ' course. Learners are shown cards with concept names that can be' +
      ' flipped to view the definition. Learners self-assess their concept' +
      ' mastery, which helps us update the cards shown in drills.',
    courseThumb: {
      notes: 'Notes',
      cards: 'Cards',
      slides: 'Slides',
    },
  },
  login: {
    alreadyLoggedIn: 'You are already logged in.',
    logout: 'Logout',
    fauLogin: 'Login through FAU IdM-Portal',
    fakeLogin: 'Fake User Login',
    rememberLogout: 'Please remember to logout after you are done.',
    logoutWarning:
      'Warning: Logging out from FAU IdM-Portal will NOT log you out here.',
    notesHeader:
      'Note that you are logging into a research prototype system' +
      ' for individualised learning support at the university level. Please' +
      ' note the following consequences:',
    notesPoint1:
      'This is not a production-ready system, so system ' +
      'functionality may change or go away without prior notice. ' +
      'You are participating in this experimental system ' +
      'voluntarily, we hope that the system will enhance your ' +
      'learning experience and success. But there will not be any ' +
      'renumeration and/or difference to the way you are graded or ' +
      'evaluated in the course.',
    notesPoint2:
      'The system will collect personalized data on all of your ' +
      'interactions with the system, including ' +
      'click/hover/mouse-movement-streams, page requests, results ' +
      'of quizzes, etc. The system uses this data to generate ' +
      'learning competency models that in turn affect the generated ' +
      'course materials and the interaction with the system.',
    notesPoint3:
      'Note that personalized data will only be accessible to ' +
      'agents that are authenticated with your personal IDM ' +
      'credentials. In particular, no personal data will be ' +
      'transmitted outside the system without your consent.',
    notesPoint4:
      'The VoLL-KI research project will use this data in ' +
      'aggregated, anonymised, and/or pseudonymized form to ' +
      'evaluate of the system and the underlying methods. We will ' +
      'use best professional effort to make sure that personalized ' +
      'data cannot be re-engineered from aggregated data. Details ' +
      'about the KI System can be found here',
    guest: {
      encourage:
        'While the VoLL-KI SSFC system is initially intended for FAU students, we ' +
        'are working on expanding our offerings to more learners. Meanwhile, we ' +
        'encourage you to login as a guest and test drive the system.',
      entryButton: 'Guest User Login',
      chooseLearnerHelperText:
        "The platform content is tailored to the learner's competencies. Please choose an initial persona above to get started.",
      personaSelect: 'Choose Persona',
      guestIdText: 'Guest Id',
      guestNameText: 'Guest Username',
      loginButton: 'Login as a guest',
    },
  },
  flashCards: {
    header: 'Configure your flash card stack for drilling/revising!',
    chooseCoverage: 'Choose the coverage',
    chooseCoverageHover: 'Choose the cards in the stack by course chapters',
    chooseCompetency: 'Choose competency levels',
    chooseCompetencyHover:
      'Choose the competency levels (estimated by the learner model) up to which cards should be included into the card stack',
    chooseCompetencyDetails:
      'The selection will put all cards up to the chosen competency level onto the stack.',
    shuffleCards: 'Shuffle drill cards',
    revise: 'Revise',
    drill: 'Drill',
    concepts: 'Concepts',
    cardsSelected: 'cards selected',

    assessYourComptence: 'Assess Your Comptence',
    flipCard: 'Flip the card to see the definition!',
    flipBack: 'Flip back!',
    prev: 'Prev',
    next: 'Next',
    showBackface: 'Show backface by default',
    leaveEarly: 'Are you sure you want to leave the drill early?',

    goBack: 'Go Back',
    rememberedAndUnderstood: 'Concepts remembered and understood',
    rememberedNotUnderstood: 'Concepts remembered but not understood',
    understoodNotRemembered: 'Concepts understood but not remembered',
    notRememberedNotUnderstood: 'Concepts neither remembered nor understood',

    concept: 'Concept',
    remember: 'Remember',
    understand: 'Understand',
  },

  vis: {
    goToTour: 'Go To Tour',
  },
  updates: {
    header: 'System Updates',
  },
  myProfile: {
    seePersonalNotes: 'See all your personal notes',
    seeCompetencyData: 'See your competency data',

    downloadData: 'Download Your Data',
    downloadNotes: 'Download your notes and comments',
    downloadProfile: 'Download your profile data',
    dataDeletion: 'Data Deletion',
    purgeData: 'Purge your data',

    choosePersona: 'Choose Persona',
    resetFake: 'Reset Fake User Data',

    confirmPurge: 'Confirm Data Purge',
    purgeWarning:
      'WARNING: This will delete all data the system has on you (learner model, interaction logs, comments, and notes) except for theinformation that/when you purged the data. Your learning experience may be significantly affected.',
    dataPurged: 'Data purged',
    purgeError: 'Some error purging data',
    purge: 'Purge',
    cancel: 'Cancel',
    confirmation: 'Confirmation',
    confirmText: 'Purge my data',
    purgeInstruction: 'Enter this text in the box below to confirm',
  },
  myLearnerModel: {
    learnerModel: 'Learner Model',
    description1:
      'Using your interactions with the system, we strive to estimate your competency of various concepts. We use the Bloom extended model',
    description2:
      ', which classifies learner competencies in six cognitive dimensions for every concept. As a consequence, you see six probability values representing the predicted competency of that concept. This competency model (a.k.a. leaner model) is used in all of the semantic services in the VoLL-KI SSFC System.',
  },
  courseView: {
    notes: 'Notes',
    instructorNotes: "Instructor's notes",
    showSlides: 'Show slides',
    showVideo: 'Show video',
    showSlidesAndVideo: 'Show slides and video',
    courseContent: 'Course Content',
    personalizedSuggestion: 'Personalized Suggestion',
  },
  // Multi-Page Components
  header: {
    headerWarning:
      'WARNING: Research Prototype, it may misbehave, crash, delete data, ... or even make you happy without warning at any time!',
    login: 'Login',
    profile: 'Profile',
    logOut: 'Log Out',
    systemUpdate: 'System Updates',
    helpCenter: 'Help Center',
    privacyPolicy: 'Privacy Policy',
    legalNotice: 'Legal Notice'
  },
};

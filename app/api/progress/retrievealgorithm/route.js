import {NextResponse} from "next/server";

export function GET(req) {
    //TODO: Change to retrieve from db
    return NextResponse.json({
            "rules": [
                {
                    "name": "Choose Profil-Schwerpunkt",
                    "conditions": {
                        "all": [
                            {
                                "fact": "profil_schwerpunkt",
                                "operator": "isIn",
                                "value": ["sprachlich", "gesellschaftlich", "musisch-künstlerisch", "mathematisch-naturwissenschaftlich", "sportlich"]
                            }
                        ]
                    },
                    "event": {
                        "type": "profil_selected",
                        "params": {
                            "message": "Profil-Schwerpunkt successfully selected."
                        }
                    }
                },
                {
                    "name": "Seminarfach is mandatory",
                    "conditions": {
                        "all": [
                            {
                                "fact": "seminarfach_semesters",
                                "operator": "contains",
                                "value": [1, 2, 3]
                            }
                        ]
                    },
                    "event": {
                        "type": "seminarfach_selected",
                        "params": {
                            "message": "Seminarfach is selected for the first three semesters."
                        }
                    }
                },
                {
                    "name": "At least two exam subjects from German, Mathematics, and Foreign Language",
                    "conditions": {
                        "all": [
                            {
                                "fact": "pruefungsfaecher",
                                "operator": "countIn",
                                "value": ["Deutsch", "Mathematik", "Englisch", "Französisch", "Latein", "Spanisch"],
                                "count": {
                                    "operator": "greaterThanInclusive",
                                    "value": 2
                                }
                            }
                        ]
                    },
                    "event": {
                        "type": "core_subjects_selected",
                        "params": {
                            "message": "At least two exam subjects from German, Mathematics, and a Foreign Language are selected."
                        }
                    }
                },
                {
                    "name": "No duplicate subjects",
                    "conditions": {
                        "all": [
                            {
                                "fact": "all_selected_subjects",
                                "operator": "equal",
                                "value": {
                                    "fact": "unique_selected_subjects"
                                }
                            }
                        ]
                    },
                    "event": {
                        "type": "no_duplicates",
                        "params": {
                            "message": "No duplicate subjects are selected."
                        }
                    }
                },
                {
                    "name": "All exam subjects selected",
                    "conditions": {
                        "all": [
                            {
                                "fact": "pruefungsfaecher",
                                "operator": "lengthEquals",
                                "value": 5
                            },
                            {
                                "fact": "pruefungsfaecher",
                                "operator": "noneNull"
                            }
                        ]
                    },
                    "event": {
                        "type": "all_exam_subjects_selected",
                        "params": {
                            "message": "All exam subjects are selected."
                        }
                    }
                },
                {
                    "name": "Exam subjects taken last year",
                    "conditions": {
                        "all": [
                            {
                                "fact": "pruefungsfaecher",
                                "operator": "subsetOf",
                                "value": {
                                    "fact": "vorjahres_faecher"
                                }
                            }
                        ]
                    },
                    "event": {
                        "type": "exam_subjects_valid",
                        "params": {
                            "message": "All exam subjects were taken in the previous school year."
                        }
                    }
                },
                {
                    "name": "SP1 and SP2 subjects for Schwerpunkt",
                    "conditions": {
                        "all": [
                            {
                                "fact": "profil_schwerpunkt",
                                "operator": "equal",
                                "value": "sprachlich"
                            },
                            {
                                "fact": "pruefungsfaecher",
                                "path": "$[0,1]",
                                "operator": "allIn",
                                "value": ["Deutsch", "Englisch", "Französisch", "Latein", "Spanisch"]
                            }
                        ]
                    },
                    "event": {
                        "type": "sp1_sp2_valid",
                        "params": {
                            "message": "SP1 and SP2 are valid for the selected Schwerpunkt."
                        }
                    }
                },
                {
                    "name": "At least one exam subject per task area",
                    "conditions": {
                        "all": [
                            {
                                "fact": "pruefungsfaecher",
                                "operator": "containsAtLeastOne",
                                "value": {
                                    "fact": "sprachlich_literarisch_künstlerisch"
                                }
                            },
                            {
                                "fact": "pruefungsfaecher",
                                "operator": "containsAtLeastOne",
                                "value": {
                                    "fact": "gesellschaftswissenschaftlich"
                                }
                            },
                            {
                                "fact": "pruefungsfaecher",
                                "operator": "containsAtLeastOne",
                                "value": {
                                    "fact": "mathematisch_naturwissenschaftlich_technisch"
                                }
                            }
                        ]
                    },
                    "event": {
                        "type": "task_areas_covered",
                        "params": {
                            "message": "At least one exam subject per task area is selected."
                        }
                    }
                },
                {
                    "name": "Belegungspflichten erfüllen",
                    "conditions": {
                        "all": [
                            {
                                "fact": "belegungspflichten_erfüllt",
                                "operator": "equal",
                                "value": true
                            }
                        ]
                    },
                    "event": {
                        "type": "belegungspflichten_completed",
                        "params": {
                            "message": "Belegungspflichten successfully fulfilled."
                        }
                    }
                },
                {
                    "name": "Choose Additional Courses",
                    "conditions": {
                        "all": [
                            {
                                "fact": "weitere_kurse",
                                "operator": "isIn",
                                "value": ["wahlfächer", "interessenskurse", "förderkurse"]
                            }
                        ]
                    },
                    "event": {
                        "type": "weitere_kurse_selected",
                        "params": {
                            "message": "Additional courses successfully chosen."
                        }
                    }
                }
            ],
            "facts": {
                "profil_schwerpunkt": null,
                "pruefungsfaecher": [],
                "pruefungsfaecher_kombination": false,
                "belegungspflichten_erfüllt": false,
                "weitere_kurse": [],
                "seminarfach_semesters": [],
                "vorjahres_faecher": [],
                "all_selected_subjects": [],
                "unique_selected_subjects": [],
                "sprachlich_literarisch_künstlerisch": ["Deutsch", "Englisch", "Französisch", "Latein", "Spanisch", "Kunst", "Musik", "Darstellendes Spiel"],
                "gesellschaftswissenschaftlich": ["Politik-Wirtschaft", "Geschichte", "Erdkunde", "Religion", "Philosophie"],
                "mathematisch_naturwissenschaftlich_technisch": ["Mathematik", "Physik", "Chemie", "Biologie", "Informatik"]
            }
        }

    )
}
// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Ensure pg_trgm extension and create SQL function for updating login dates
async function createSqlFunctions() {
  await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS pg_trgm;`;
  await prisma.$executeRaw`
    CREATE OR REPLACE FUNCTION update_login_date(p_email TEXT) RETURNS VOID AS $$
    DECLARE
      prev TIMESTAMP;
    BEGIN
      SELECT "lastLoginDate" INTO prev FROM "users" WHERE email = p_email;
      UPDATE "users"
      SET
        "previousLoginDate" = prev,
        "lastLoginDate" = now()
      WHERE email = p_email;
    END;
    $$ LANGUAGE plpgsql;
  `;
}

// Initial data for a default creationfiles entry with id=0
const initialCreationFileData = {
    "Steps": [
        {
            "StepName": "Fokus wählen",
            "StepValues": [
                {
                    "name": "Focus",
                    "type": "select",
                    "values": [
                        {
                            "value": "sprachlich",
                            "groups": [
                                "sprachen"
                            ],
                            "displayText": "Sprachlich"
                        },
                        {
                            "value": "kuenstlerisch",
                            "displayText": "Künstlerisch-Musisch"
                        },
                        {
                            "value": "gesellschaftswissenschaftlich",
                            "displayText": "Gesellschaftswissenschaftlich"
                        },
                        {
                            "value": "mathematisch",
                            "displayText": "Mathematisch-Naturwissenschaftlich"
                        },
                        {
                            "value": "sportlich",
                            "displayText": "Sport"
                        }
                    ]
                }
            ]
        },
        {
            "StepName": "Select Pruefungsfächer (P1-P5)",
            "Conditions": [
                {
                    "conditionName": "hauptfächer_gewaehlt",
                    "conditionError": "Du musst mindestens zwei Hauptfächer gewählt haben!",
                    "conditionLogic": [
                        {
                            "value": "hauptfach",
                            "logicType": "group_greaterOrEqual",
                            "conditionValue": 2
                        }
                    ],
                    "conditionBehaviour": "AND"
                },
                {
                    "conditionName": "aufgabenfelder_abgedeckt",
                    "conditionError": "Du musst alle Aufgabenfelder abgedeckt haben!",
                    "conditionLogic": [
                        {
                            "value": "sprachlich-literarisch-kuenstlerisch",
                            "logicType": "group_greaterOrEqual",
                            "conditionValue": 1
                        },
                        {
                            "value": "gesellschafts-wissenschaftlich",
                            "logicType": "group_greaterOrEqual",
                            "conditionValue": 1
                        },
                        {
                            "value": "mathematisch-naturwissenschaftlich-technisch",
                            "logicType": "group_greaterOrEqual",
                            "conditionValue": 1
                        }
                    ],
                    "conditionBehaviour": "AND"
                }
            ],
            "StepValues": [
                {
                    "name": "P1",
                    "type": "dropdown",
                    "hours": 5,
                    "values": [
                        {
                            "value": "deutsch",
                            "groups": [
                                "hauptfach",
                                "sprachlich-literarisch-kuenstlerisch"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": "sprachlich"
                                }
                            ],
                            "displayText": "Deutsch",
                            "displayPosition": "A_0"
                        },
                        {
                            "value": "englisch",
                            "groups": [
                                "hauptfach",
                                "sprachlich-literarisch-kuenstlerisch"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": "sprachlich"
                                }
                            ],
                            "displayText": "Englisch"
                        },
                        {
                            "value": "franzoesisch",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "fremdsprache"
                            ],
                            "unique": "groupName-fremdsprache",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": "sprachlich"
                                }
                            ],
                            "displayText": "Französisch"
                        },
                        {
                            "value": "spanisch",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "fremdsprache"
                            ],
                            "unique": "groupName-fremdsprache",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": "sprachlich"
                                }
                            ],
                            "displayText": "Spanisch"
                        },
                        {
                            "value": "latein",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "fremdsprache"
                            ],
                            "unique": "groupName-fremdsprache",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": "sprachlich"
                                }
                            ],
                            "displayText": "Latein"
                        },
                        {
                            "value": "kunst",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": "kuenstlerisch"
                                }
                            ],
                            "displayText": "Kunst"
                        },
                        {
                            "value": "musik",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": "kuenstlerisch"
                                }
                            ],
                            "displayText": "Musik"
                        },
                        {
                            "value": "geschichte",
                            "groups": [
                                "gesellschafts-wissenschaftlich"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": "gesellschaftswissenschaftlich"
                                }
                            ],
                            "displayText": "Geschichte"
                        },
                        {
                            "value": "sport",
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": "sportlich"
                                }
                            ],
                            "displayText": "Sport"
                        },
                        {
                            "value": "mathematik",
                            "groups": [
                                "hauptfach",
                                "mathematisch-naturwissenschaftlich-technisch"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": "mathematisch"
                                }
                            ],
                            "displayText": "Mathematik"
                        },
                        {
                            "value": "chemie",
                            "groups": [
                                "mathematisch-naturwissenschaftlich-technisch"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": "mathematisch"
                                }
                            ],
                            "displayText": "Chemie"
                        },
                        {
                            "value": "physik",
                            "groups": [
                                "mathematisch-naturwissenschaftlich-technisch"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": "mathematisch"
                                }
                            ],
                            "displayText": "Physik"
                        },
                        {
                            "value": "biologie",
                            "groups": [
                                "mathematisch-naturwissenschaftlich-technisch"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": "mathematisch"
                                }
                            ],
                            "displayText": "Biologie"
                        }
                    ],
                    "semester": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "pfachText": "P1"
                },
                {
                    "name": "P2",
                    "type": "dropdown",
                    "hours": 5,
                    "values": [
                        {
                            "value": "deutsch",
                            "groups": [
                                "hauptfach",
                                "sprachlich-literarisch-kuenstlerisch"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "kuenstlerisch",
                                        "sprachlich"
                                    ]
                                }
                            ],
                            "displayText": "Deutsch"
                        },
                        {
                            "value": "mathematik",
                            "groups": [
                                "hauptfach",
                                "mathematisch-naturwissenschaftlich-technisch"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "mathematisch",
                                        "sportlich"
                                    ]
                                }
                            ],
                            "displayText": "Mathematik"
                        },
                        {
                            "value": "englisch",
                            "groups": [
                                "hauptfach",
                                "sprachlich-literarisch-kuenstlerisch"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "sprachlich",
                                        "gesellschaftswissenschaftlich"
                                    ]
                                }
                            ],
                            "displayText": "Englisch"
                        },
                        {
                            "value": "franzoesisch",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "fremdsprache"
                            ],
                            "unique": "groupName-fremdsprache",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "sprachlich",
                                        "gesellschaftswissenschaftlich"
                                    ]
                                }
                            ],
                            "displayText": "Französisch"
                        },
                        {
                            "value": "latein",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "fremdsprache"
                            ],
                            "unique": "groupName-fremdsprache",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "sprachlich",
                                        "gesellschaftswissenschaftlich"
                                    ]
                                }
                            ],
                            "displayText": "Latein"
                        },
                        {
                            "value": "spanisch",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "fremdsprache"
                            ],
                            "unique": "groupName-fremdsprache",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "sprachlich",
                                        "gesellschaftswissenschaftlich"
                                    ]
                                }
                            ],
                            "displayText": "Spanisch"
                        },
                        {
                            "value": "physik",
                            "groups": [
                                "mathematisch-naturwissenschaftlich-technisch"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "mathematisch",
                                        "sportlich"
                                    ]
                                }
                            ],
                            "displayText": "Physik"
                        },
                        {
                            "value": "chemie",
                            "groups": [
                                "mathematisch-naturwissenschaftlich-technisch"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "mathematisch",
                                        "sportlich"
                                    ]
                                }
                            ],
                            "displayText": "Chemie"
                        },
                        {
                            "value": "biologie",
                            "groups": [
                                "mathematisch-naturwissenschaftlich-technisch"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "mathematisch",
                                        "sportlich"
                                    ]
                                }
                            ],
                            "displayText": "Biologie"
                        }
                    ],
                    "semester": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "pfachText": "P2"
                },
                {
                    "name": "P3",
                    "type": "dropdown",
                    "hours": 5,
                    "values": [
                        {
                            "value": "physik",
                            "groups": [
                                "mathematisch-naturwissenschaftlich-technisch",
                                "naturwissenschaft_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "mathematisch",
                                        "sprachlich",
                                        "kuenstlerisch",
                                        "sportlich"
                                    ]
                                }
                            ],
                            "displayText": "Physik"
                        },
                        {
                            "value": "politik-wirtschaft",
                            "groups": [
                                "gesellschafts-wissenschaftlich"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Politik-Wirtschaft"
                        },
                        {
                            "value": "deutsch",
                            "groups": [
                                "hauptfach",
                                "sprachlich-literarisch-kuenstlerisch"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "mathematisch",
                                        "sprachlich",
                                        "kuenstlerisch",
                                        "sportlich"
                                    ]
                                }
                            ],
                            "displayText": "Deutsch"
                        },
                        {
                            "value": "englisch",
                            "groups": [
                                "hauptfach",
                                "sprachlich-literarisch-kuenstlerisch",
                                "fremdsprache_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "mathematisch",
                                        "sprachlich",
                                        "kuenstlerisch",
                                        "sportlich"
                                    ]
                                }
                            ],
                            "displayText": "Englisch"
                        },
                        {
                            "value": "latein",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "fremdsprache",
                                "fremdsprache_p3-p5"
                            ],
                            "unique": "groupName-fremdsprache",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "mathematisch",
                                        "sprachlich",
                                        "kuenstlerisch",
                                        "sportlich"
                                    ]
                                }
                            ],
                            "displayText": "Latein"
                        },
                        {
                            "value": "sport",
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "mathematisch",
                                        "sprachlich",
                                        "kuenstlerisch",
                                        "sportlich"
                                    ]
                                }
                            ],
                            "displayText": "Sport"
                        },
                        {
                            "value": "erdkunde",
                            "groups": [
                                "gesellschafts-wissenschaftlich"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Erdkunde"
                        },
                        {
                            "value": "franzoesisch",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "fremdsprache",
                                "fremdsprache_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "mathematisch",
                                        "sprachlich",
                                        "kuenstlerisch",
                                        "sportlich"
                                    ]
                                }
                            ],
                            "displayText": "Französisch"
                        },
                        {
                            "value": "spanisch",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "fremdsprache",
                                "fremdsprache_p3-p5"
                            ],
                            "unique": "groupName-fremdsprache",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "mathematisch",
                                        "sprachlich",
                                        "kuenstlerisch",
                                        "sportlich"
                                    ]
                                }
                            ],
                            "displayText": "Spanisch"
                        },
                        {
                            "value": "kunst",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "kuenstler_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "mathematisch",
                                        "sprachlich",
                                        "kuenstlerisch",
                                        "sportlich"
                                    ]
                                }
                            ],
                            "displayText": "Kunst"
                        },
                        {
                            "value": "musik",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "kuenstler_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "mathematisch",
                                        "sprachlich",
                                        "kuenstlerisch",
                                        "sportlich"
                                    ]
                                }
                            ],
                            "displayText": "Musik"
                        },
                        {
                            "value": "geschichte",
                            "groups": [
                                "gesellschafts-wissenschaftlich"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "mathematisch",
                                        "sprachlich",
                                        "kuenstlerisch",
                                        "sportlich"
                                    ]
                                }
                            ],
                            "displayText": "Geschichte"
                        },
                        {
                            "value": "religion",
                            "groups": [
                                "gesellschafts-wissenschaftlich",
                                "philo-reli_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "mathematisch",
                                        "sprachlich",
                                        "kuenstlerisch",
                                        "sportlich"
                                    ]
                                }
                            ],
                            "displayText": "Religion"
                        },
                        {
                            "value": "mathematik",
                            "groups": [
                                "hauptfach",
                                "mathematisch-naturwissenschaftlich-technisch"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "mathematisch",
                                        "sprachlich",
                                        "kuenstlerisch",
                                        "sportlich"
                                    ]
                                }
                            ],
                            "displayText": "Mathematik"
                        },
                        {
                            "value": "chemie",
                            "groups": [
                                "gesellschafts-wissenschaftlich",
                                "naturwissenschaft_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "mathematisch",
                                        "sprachlich",
                                        "kuenstlerisch",
                                        "sportlich"
                                    ]
                                }
                            ],
                            "displayText": "Chemie"
                        },
                        {
                            "value": "biologie",
                            "groups": [
                                "mathematisch-naturwissenschaftlich-technisch",
                                "naturwissenschaft_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "mathematisch",
                                        "sprachlich",
                                        "kuenstlerisch",
                                        "sportlich"
                                    ]
                                }
                            ],
                            "displayText": "Bio"
                        },
                        {
                            "value": "philosophie",
                            "groups": [
                                "philo-reli_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [
                                {
                                    "value": "0_Focus",
                                    "logicType": "value_equals",
                                    "conditionValue": [
                                        "mathematisch",
                                        "sprachlich",
                                        "kuenstlerisch",
                                        "sportlich"
                                    ]
                                }
                            ],
                            "displayText": "Philosophie"
                        }
                    ],
                    "semester": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "pfachText": "P3"
                },
                {
                    "name": "P4",
                    "type": "dropdown",
                    "hours": 3,
                    "values": [
                        {
                            "value": "deutsch",
                            "groups": [
                                "hauptfach",
                                "sprachlich-literarisch-kuenstlerisch"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Deutsch"
                        },
                        {
                            "value": "englisch",
                            "groups": [
                                "hauptfach",
                                "sprachlich-literarisch-kuenstlerisch",
                                "fremdsprache_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Englisch"
                        },
                        {
                            "value": "franzoesisch",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "fremdsprache",
                                "fremdsprache_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Französisch"
                        },
                        {
                            "value": "latein",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "fremdsprache",
                                "fremdsprache_p3-p5"
                            ],
                            "unique": "groupName-fremdsprache",
                            "conditions": [],
                            "displayText": "Latein"
                        },
                        {
                            "value": "spanisch",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "fremdsprache",
                                "fremdsprache_p3-p5"
                            ],
                            "unique": "groupName-fremdsprache",
                            "conditions": [],
                            "displayText": "Spanisch"
                        },
                        {
                            "value": "kunst",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "fremdsprache",
                                "kuenstler_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Kunst"
                        },
                        {
                            "value": "musik",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "kuenstler_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Musik"
                        },
                        {
                            "value": "politik-wirtschaft",
                            "groups": [
                                "gesellschafts-wissenschaftlich"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Politik-Wirtschaft"
                        },
                        {
                            "value": "geschichte",
                            "groups": [
                                "gesellschafts-wissenschaftlich"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Geschichte"
                        },
                        {
                            "value": "erdkunde",
                            "groups": [
                                "gesellschafts-wissenschaftlich"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Erdkunde"
                        },
                        {
                            "value": "religion",
                            "groups": [
                                "gesellschafts-wissenschaftlich",
                                "philo-reli_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Religion"
                        },
                        {
                            "value": "mathematik",
                            "groups": [
                                "hauptfach",
                                "mathematisch-naturwissenschaftlich-technisch"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Mathematik"
                        },
                        {
                            "value": "physik",
                            "groups": [
                                "mathematisch-naturwissenschaftlich-technisch",
                                "naturwissenschaft_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Physik"
                        },
                        {
                            "value": "chemie",
                            "groups": [
                                "mathematisch-naturwissenschaftlich-technisch",
                                "naturwissenschaft_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Chemie"
                        },
                        {
                            "value": "biologie",
                            "groups": [
                                "mathematisch-naturwissenschaftlich-technisch",
                                "naturwissenschaft_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Biologie"
                        },
                        {
                            "value": "philosophie",
                            "groups": [
                                "gesellschafts-wissenschaftlich",
                                "philo-reli_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Philosophie"
                        }
                    ],
                    "semester": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "pfachText": "P4"
                },
                {
                    "name": "P5",
                    "type": "dropdown",
                    "hours": 3,
                    "values": [
                        {
                            "value": "deutsch",
                            "groups": [
                                "hauptfach",
                                "sprachlich-literarisch-kuenstlerisch"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Deutsch"
                        },
                        {
                            "value": "englisch",
                            "groups": [
                                "hauptfach",
                                "sprachlich-literarisch-kuenstlerisch",
                                "fremdsprache_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Englisch"
                        },
                        {
                            "value": "franzoesisch",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "fremdsprache",
                                "fremdsprache_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Französisch"
                        },
                        {
                            "value": "latein",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "fremdsprache",
                                "fremdsprache_p3-p5"
                            ],
                            "unique": "groupName-fremdsprache",
                            "conditions": [],
                            "displayText": "Latein"
                        },
                        {
                            "value": "spanisch",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "fremdsprache",
                                "fremdsprache_p3-p5"
                            ],
                            "unique": "groupName-fremdsprache",
                            "conditions": [],
                            "displayText": "Spanisch"
                        },
                        {
                            "value": "kunst",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "kuenstler_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Kunst"
                        },
                        {
                            "value": "musik",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "kuenstler_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Musik"
                        },
                        {
                            "value": "politik-wirtschaft",
                            "groups": [
                                "gesellschafts-wissenschaftlich"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Politik-Wirtschaft"
                        },
                        {
                            "value": "geschichte",
                            "groups": [
                                "gesellschafts-wissenschaftlich"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Geschichte"
                        },
                        {
                            "value": "erdkunde",
                            "groups": [
                                "gesellschafts-wissenschaftlich"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Erdkunde"
                        },
                        {
                            "value": "religion",
                            "groups": [
                                "gesellschafts-wissenschaftlich",
                                "philo-reli_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Religion"
                        },
                        {
                            "value": "mathematik",
                            "groups": [
                                "hauptfach",
                                "mathematisch-naturwissenschaftlich-technisch"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Mathematik"
                        },
                        {
                            "value": "physik",
                            "groups": [
                                "mathematisch-naturwissenschaftlich-technisch",
                                "naturwissenschaft_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Physik"
                        },
                        {
                            "value": "chemie",
                            "groups": [
                                "mathematisch-naturwissenschaftlich-technisch",
                                "naturwissenschaft_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Chemie"
                        },
                        {
                            "value": "biologie",
                            "groups": [
                                "mathematisch-naturwissenschaftlich-technisch",
                                "naturwissenschaft_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Biologie"
                        },
                        {
                            "value": "philosophie",
                            "groups": [
                                "gesellschafts-wissenschaftlich",
                                "philo-reli_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Philosophie"
                        },
                        {
                            "value": "dsp",
                            "groups": [
                                "sprachlich-literarisch-kuenstlerisch",
                                "kuenstler_p3-p5"
                            ],
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Darstellendes Spiel"
                        },
                        {
                            "value": "sport",
                            "unique": "*",
                            "conditions": [],
                            "displayText": "Sport"
                        }
                    ],
                    "semester": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "pfachText": "P5"
                }
            ]
        },
        {
            "StepName": "Belegungsverpflichtungen erfüllen",
            "StepValues": [
                {
                    "name": "Deutsch",
                    "type": "dropdown",
                    "hours": 3,
                    "values": [
                        {
                            "value": "deutsch",
                            "dontHide": false,
                            "conditions": [
                                {
                                    "value": "1",
                                    "logicType": "!used_in_step",
                                    "conditionValue": "deutsch"
                                }
                            ],
                            "displayText": "Deutsch"
                        },
                        {
                            "value": "belegungsverpflichtung_erfüllt_deutsch",
                            "dontHide": false,
                            "overrides": [
                                {
                                    "hours": 0,
                                    "semester": [],
                                    "conditions": []
                                }
                            ],
                            "conditions": [
                                {
                                    "value": "1",
                                    "logicType": "used_in_step",
                                    "conditionValue": "deutsch"
                                }
                            ],
                            "displayText": "Belegungsverpflichtung erfüllt"
                        }
                    ],
                    "semester": [
                        1,
                        2
                    ]
                },
                {
                    "name": "Fremdsprache",
                    "type": "dropdown",
                    "hours": 3,
                    "values": [
                        {
                            "value": "belegungsverpflichtung_erfüllt_fremdsprache",
                            "dontHide": false,
                            "overrides": [
                                {
                                    "hours": 0,
                                    "semester": [],
                                    "conditions": []
                                }
                            ],
                            "conditions": [
                                {
                                    "value": "fremdsprache_p3-p5",
                                    "logicType": "group_greaterOrEqual",
                                    "conditionValue": 1
                                }
                            ],
                            "displayText": "Belegungsverpflichtung erfüllt"
                        },
                        {
                            "value": "englisch",
                            "dontHide": false,
                            "conditions": [
                                {
                                    "value": "fremdsprache_p3-p5",
                                    "logicType": "!group_greaterOrEqual",
                                    "conditionValue": 1
                                }
                            ],
                            "displayText": "Englisch"
                        },
                        {
                            "value": "franzoesisch",
                            "dontHide": false,
                            "conditions": [
                                {
                                    "value": "fremdsprache_p3-p5",
                                    "logicType": "!group_greaterOrEqual",
                                    "conditionValue": 1
                                }
                            ],
                            "displayText": "Französisch"
                        },
                        {
                            "value": "spanisch",
                            "dontHide": false,
                            "conditions": [
                                {
                                    "value": "fremdsprache_p3-p5",
                                    "logicType": "!group_greaterOrEqual",
                                    "conditionValue": 1
                                }
                            ],
                            "displayText": "Spanisch"
                        },
                        {
                            "value": "latein",
                            "dontHide": false,
                            "conditions": [
                                {
                                    "value": "fremdsprache_p3-p5",
                                    "logicType": "!group_greaterOrEqual",
                                    "conditionValue": 1
                                }
                            ],
                            "displayText": "Latein"
                        }
                    ],
                    "semester": [
                        1,
                        2
                    ]
                },
                {
                    "name": "Kunst, Musik, DSP",
                    "type": "dropdown",
                    "hours": 3,
                    "values": [
                        {
                            "value": "belegungsverpflichtung_erfüllt_kuenstler",
                            "dontHide": false,
                            "overrides": [
                                {
                                    "hours": 0,
                                    "semester": [],
                                    "conditions": []
                                }
                            ],
                            "conditions": [
                                {
                                    "value": "kuenstler_p3-p5",
                                    "logicType": "group_greaterOrEqual",
                                    "conditionValue": 1
                                }
                            ],
                            "displayText": "Belegungsverpflichtung erfüllt"
                        },
                        {
                            "value": "kunst",
                            "dontHide": false,
                            "conditions": [
                                {
                                    "value": "kuenstler_p3-p5",
                                    "logicType": "!group_greaterOrEqual",
                                    "conditionValue": 1
                                }
                            ],
                            "displayText": "Kunst"
                        },
                        {
                            "value": "musik",
                            "dontHide": false,
                            "conditions": [
                                {
                                    "value": "kuenstler_p3-p5",
                                    "logicType": "!group_greaterOrEqual",
                                    "conditionValue": 1
                                }
                            ],
                            "displayText": "Musik"
                        },
                        {
                            "value": "dsp",
                            "dontHide": false,
                            "conditions": [
                                {
                                    "value": "kuenstler_p3-p5",
                                    "logicType": "!group_greaterOrEqual",
                                    "conditionValue": 1
                                }
                            ],
                            "displayText": "Darstellendes Spiel"
                        }
                    ],
                    "semester": [
                        1,
                        2
                    ]
                },
                {
                    "name": "PoWi",
                    "type": "dropdown",
                    "hours": 3,
                    "values": [
                        {
                            "value": "politik-wirtschaft",
                            "dontHide": false,
                            "conditions": [
                                {
                                    "value": "1",
                                    "logicType": "!used_in_step",
                                    "conditionValue": "politik-wirtschaft"
                                }
                            ],
                            "displayText": "Politik-Wirtschaft"
                        },
                        {
                            "value": "belegungsverpflichtung_erfüllt_politik-wirtschaft",
                            "dontHide": false,
                            "overrides": [
                                {
                                    "hours": 0,
                                    "semester": [],
                                    "conditions": []
                                }
                            ],
                            "conditions": [
                                {
                                    "value": "1",
                                    "logicType": "used_in_step",
                                    "conditionValue": "politik-wirtschaft"
                                }
                            ],
                            "displayText": "Belegungsverpflichtung erfüllt"
                        }
                    ],
                    "semester": [
                        1,
                        2
                    ]
                },
                {
                    "name": "Geschichte",
                    "type": "dropdown",
                    "hours": 3,
                    "values": [
                        {
                            "value": "geschichte",
                            "dontHide": false,
                            "conditions": [
                                {
                                    "value": "1",
                                    "logicType": "!used_in_step",
                                    "conditionValue": "geschichte"
                                }
                            ],
                            "displayText": "Geschichte"
                        },
                        {
                            "value": "belegungsverpflichtung_erfüllt_geschichte",
                            "dontHide": false,
                            "overrides": [
                                {
                                    "hours": 0,
                                    "semester": [],
                                    "conditions": []
                                }
                            ],
                            "conditions": [
                                {
                                    "value": "1",
                                    "logicType": "used_in_step",
                                    "conditionValue": "geschichte"
                                }
                            ],
                            "displayText": "Belegungsverpflichtung erfüllt"
                        }
                    ],
                    "semester": [
                        1,
                        2
                    ]
                },
                {
                    "name": "Philosophie, Religion",
                    "type": "dropdown",
                    "hours": 3,
                    "values": [
                        {
                            "value": "belegungsverpflichtung_erfüllt_philo-reli",
                            "dontHide": false,
                            "overrides": [
                                {
                                    "hours": 0,
                                    "semester": [],
                                    "conditions": []
                                }
                            ],
                            "conditions": [
                                {
                                    "value": "philo-reli_p3-p5",
                                    "logicType": "group_greaterOrEqual",
                                    "conditionValue": 1
                                }
                            ],
                            "displayText": "Belegungsverpflichtung erfüllt"
                        },
                        {
                            "value": "philosophie",
                            "dontHide": false,
                            "conditions": [
                                {
                                    "value": "philo-reli_p3-p5",
                                    "logicType": "!group_greaterOrEqual",
                                    "conditionValue": 1
                                }
                            ],
                            "displayText": "Philosophie"
                        },
                        {
                            "value": "religion",
                            "dontHide": false,
                            "conditions": [
                                {
                                    "value": "philo-reli_p3-p5",
                                    "logicType": "!group_greaterOrEqual",
                                    "conditionValue": 1
                                }
                            ],
                            "displayText": "Religion"
                        }
                    ],
                    "semester": [
                        1,
                        2
                    ]
                },
                {
                    "name": "Mathematik",
                    "type": "dropdown",
                    "hours": 3,
                    "values": [
                        {
                            "value": "mathematik",
                            "dontHide": false,
                            "conditions": [
                                {
                                    "value": "1",
                                    "logicType": "!used_in_step",
                                    "conditionValue": "mathematik"
                                }
                            ],
                            "displayText": "Mathematik"
                        },
                        {
                            "value": "belegungsverpflichtung_erfüllt_mathematik",
                            "dontHide": false,
                            "overrides": [
                                {
                                    "hours": 0,
                                    "semester": [],
                                    "conditions": []
                                }
                            ],
                            "conditions": [
                                {
                                    "value": "1",
                                    "logicType": "used_in_step",
                                    "conditionValue": "mathematik"
                                }
                            ],
                            "displayText": "Belegungsverpflichtung erfüllt"
                        }
                    ],
                    "semester": [
                        1,
                        2
                    ]
                },
                {
                    "name": "Naturwissenschaften",
                    "type": "dropdown",
                    "hours": 3,
                    "values": [
                        {
                            "value": "belegungsverpflichtung_erfüllt_naturwissenschaften",
                            "dontHide": false,
                            "overrides": [
                                {
                                    "hours": 0,
                                    "semester": [],
                                    "conditions": []
                                }
                            ],
                            "conditions": [
                                {
                                    "value": "naturwissenschaft_p3-p5",
                                    "logicType": "group_greaterOrEqual",
                                    "conditionValue": 1
                                }
                            ],
                            "displayText": "Physik"
                        },
                        {
                            "value": "physik",
                            "dontHide": false,
                            "conditions": [
                                {
                                    "value": "naturwissenschaft_p3-p5",
                                    "logicType": "!group_greaterOrEqual",
                                    "conditionValue": 1
                                }
                            ],
                            "displayText": "Physik"
                        },
                        {
                            "value": "chemie",
                            "dontHide": false,
                            "conditions": [
                                {
                                    "value": "naturwissenschaft_p3-p5",
                                    "logicType": "!group_greaterOrEqual",
                                    "conditionValue": 1
                                }
                            ],
                            "displayText": "Chemie"
                        },
                        {
                            "value": "biologie",
                            "dontHide": false,
                            "conditions": [
                                {
                                    "value": "naturwissenschaft_p3-p5",
                                    "logicType": "!group_greaterOrEqual",
                                    "conditionValue": 1
                                }
                            ],
                            "displayText": "Biologie"
                        }
                    ],
                    "semester": [
                        1,
                        2
                    ]
                },
                {
                    "name": "Sport",
                    "type": "dropdown",
                    "hours": 3,
                    "values": [
                        {
                            "value": "sport",
                            "dontHide": false,
                            "conditions": [
                                {
                                    "value": "1",
                                    "logicType": "!used_in_step",
                                    "conditionValue": "sport"
                                }
                            ],
                            "displayText": "Sport"
                        },
                        {
                            "value": "attest",
                            "dontHide": false,
                            "conditions": [
                                {
                                    "value": "1",
                                    "logicType": "!used_in_step",
                                    "conditionValue": "sport"
                                }
                            ],
                            "displayText": "Attest",
                            "overrides": {
                                "hours": 0,
                                "semester": []
                            }
                        },
                        {
                            "value": "sporttheorie",
                            "dontHide": false,
                            "overrides": [
                                {
                                    "hours": 1,
                                    "semester": [
                                        1,
                                        2,
                                        3,
                                        4
                                    ],
                                    "conditions": []
                                }
                            ],
                            "conditions": [
                                {
                                    "value": "1",
                                    "logicType": "used_in_step",
                                    "conditionValue": "sport"
                                }
                            ],
                            "displayText": "Sporttheorie"
                        }
                    ],
                    "semester": [
                        1,
                        2
                    ]
                },
                {
                    "name": "Seminarfach",
                    "type": "dropdown",
                    "hours": 3,
                    "values": [
                        {
                            "value": "seminarfach",
                            "unique": "none",
                            "dontHide": false,
                            "displayText": "Seminarfach"
                        }
                    ],
                    "semester": [
                        1,
                        2
                    ]
                }
            ]
        },
        {
            "StepName": "Weitere Kurse wählen",
            "StepValues": [
                {
                    "name": "Zusatzkurs",
                    "type": "dropdown",
                    "values": [
                        {
                            "value": "keinen_zusatzkurs",
                            "dontHide": false,
                            "conditions": [],
                            "displayText": "Keinen Zusatzkurs"
                        },
                        {
                            "value": "informatik",
                            "unique": "*",
                            "dontHide": false,
                            "conditions": [],
                            "displayText": "Informatik"
                        },
                        {
                            "value": "kunst",
                            "unique": "*",
                            "dontHide": false,
                            "conditions": [],
                            "displayText": "Kunst"
                        },
                        {
                            "value": "musik",
                            "unique": "*",
                            "dontHide": false,
                            "conditions": [],
                            "displayText": "Musik"
                        },
                        {
                            "value": "dsp",
                            "unique": "*",
                            "dontHide": false,
                            "conditions": [],
                            "displayText": "Darstellendes Spiel"
                        },
                        {
                            "value": "politik-wirtschaft",
                            "unique": "*",
                            "dontHide": false,
                            "conditions": [],
                            "displayText": "Politik-Wirtschaft"
                        },
                        {
                            "value": "geschichte",
                            "unique": "*",
                            "dontHide": false,
                            "conditions": [],
                            "displayText": "Geschichte"
                        },
                        {
                            "value": "erdkunde",
                            "unique": "*",
                            "dontHide": false,
                            "conditions": [],
                            "displayText": "Erdkunde"
                        },
                        {
                            "value": "biologie",
                            "unique": "*",
                            "dontHide": false,
                            "conditions": [],
                            "displayText": "Biologie"
                        },
                        {
                            "value": "physik",
                            "unique": "*",
                            "dontHide": false,
                            "conditions": [],
                            "displayText": "Physik"
                        },
                        {
                            "value": "chemie",
                            "unique": "*",
                            "dontHide": false,
                            "conditions": [],
                            "displayText": "Chemie"
                        },
                        {
                            "value": "franzoesisch",
                            "unique": "*",
                            "dontHide": false,
                            "conditions": [],
                            "displayText": "Französisch"
                        },
                        {
                            "value": "spanisch",
                            "unique": "*",
                            "dontHide": false,
                            "conditions": [],
                            "displayText": "Spanisch"
                        },
                        {
                            "value": "latein",
                            "unique": "*",
                            "dontHide": false,
                            "conditions": [],
                            "displayText": "Latein"
                        },
                        {
                            "value": "philosophie",
                            "unique": "*",
                            "dontHide": false,
                            "conditions": [],
                            "displayText": "Philosophie"
                        },
                        {
                            "value": "religion",
                            "unique": "*",
                            "dontHide": false,
                            "conditions": [],
                            "displayText": "Religion"
                        },
                        {
                            "value": "englisch",
                            "unique": "*",
                            "dontHide": false,
                            "conditions": [],
                            "displayText": "Englisch"
                        }
                    ],
                    "standardvalue": "keinen_zusatzkurs"
                }
            ]
        }
    ],
    "FileLayout": [
        "IGS-Buchholz",
        "Name: $schuelername$",
        "Klasse: $klasse$",
        "Profil: $0_Focus$",
        "$kurse$"
    ],
    "CategorySort": [
        "A",
        "B",
        "C",
        ""
    ],
    "SubjectConfig": [
        {
            "value": "deutsch",
            "groups": "",
            "displayPosition": "A_0"
        },
        {
            "value": "englisch",
            "groups": "",
            "displayPosition": "A_1"
        },
        {
            "value": "franzoesisch",
            "groups": "",
            "displayPosition": "A_2"
        },
        {
            "value": "latein",
            "groups": "",
            "displayPosition": "A_3"
        },
        {
            "value": "spanisch",
            "groups": "",
            "displayPosition": "A_4"
        },
        {
            "value": "kunst",
            "groups": "",
            "displayPosition": "A_5"
        },
        {
            "value": "musik",
            "groups": "",
            "displayPosition": "A_6"
        },
        {
            "value": "dsp",
            "groups": "",
            "displayPosition": "A_7"
        },
        {
            "value": "politik-wirtschaft",
            "groups": "",
            "displayPosition": "B_0"
        },
        {
            "value": "geschichte",
            "groups": "",
            "displayPosition": "B_1"
        },
        {
            "value": "erdkunde",
            "groups": "",
            "displayPosition": "B_2"
        },
        {
            "value": "philosophie",
            "groups": "",
            "displayPosition": "B_3"
        },
        {
            "value": "religion",
            "groups": "",
            "displayPosition": "B_4"
        },
        {
            "value": "mathematik",
            "groups": "",
            "displayPosition": "C_0"
        },
        {
            "value": "physik",
            "groups": "",
            "displayPosition": "C_1"
        },
        {
            "value": "chemie",
            "groups": "",
            "displayPosition": "C_2"
        },
        {
            "value": "biologie",
            "groups": "",
            "displayPosition": "C_3"
        },
        {
            "value": "informatik",
            "groups": "",
            "displayPosition": "C_4"
        },
        {
            "value": "sport",
            "groups": "",
            "displayPosition": "_0"
        },
        {
            "value": "sporttheorie",
            "groups": "",
            "displayPosition": "_1"
        },
        {
            "value": "seminarfach",
            "groups": "",
            "displayPosition": "_2"
        }
    ]
}
// Ensure there is a creationfiles entry with id = 0
async function ensureCreationFile() {
  const existing = await prisma.creationfiles.findUnique({ where: { id: 0 } });
  if (!existing) {
    await prisma.creationfiles.create({
      data: {
        id: 0,
        created_at: new Date(),
        data: initialCreationFileData
      }
    });
    console.log('Inserted initial creationfiles entry with id=0');
  }
}

// Wrapper to invoke the SQL function
async function updateLoginDate(email) {
  await prisma.$executeRaw`SELECT update_login_date(${email});`;
}


async function main() {
    // Create or replace SQL functions
    await createSqlFunctions();
    // Ensure default creationfiles entry exists
    await ensureCreationFile();
    // example: update for one or multiple users
    const emailsToUpdate = [
        'alice@example.com',
        'bob@example.com'
    ]

    for (const email of emailsToUpdate) {
        try {
            await updateLoginDate(email)
            console.log(`Updated login dates for ${email}`)
        } catch (err) {
            console.error(err.message)
        }
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

module.exports = { updateLoginDate }
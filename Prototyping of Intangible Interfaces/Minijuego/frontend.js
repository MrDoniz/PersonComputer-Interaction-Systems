{
    "interactionModel": {
        "languageModel": {
            "invocationName": "prototipo funcional dos",
            "intents": [
                {
                    "name": "AMAZON.CancelIntent",
                    "samples": [
                        "cancela la skills"
                    ]
                },
                {
                    "name": "AMAZON.HelpIntent",
                    "samples": [
                        "ayuda"
                    ]
                },
                {
                    "name": "AMAZON.StopIntent",
                    "samples": [
                        "para"
                    ]
                },
                {
                    "name": "AnswerIntent",
                    "slots": [
                        {
                            "name": "animal",
                            "type": "animal"
                        }
                    ],
                    "samples": [
                        "{animal}",
                        "un {animal}",
                        "una {animal}"
                    ]
                },
                {
                    "name": "AMAZON.YesIntent",
                    "samples": []
                },
                {
                    "name": "AMAZON.NoIntent",
                    "samples": []
                },
                {
                    "name": "AMAZON.RepeatIntent",
                    "samples": [
                        "Repite la pregunta",
                        "Vuelve a decirlo",
                        "Dime otra vez",
                        "Dime de nuevo",
                        "Repítemelo",
                        "Repite de nuevo",
                        "Repite"
                    ]
                },
                {
                    "name": "PendingIntent",
                    "slots": [],
                    "samples": [
                        "pendiente",
                        "dime la pregunta pendiente",
                        "dime la pendiente"
                    ]
                },
                {
                    "name": "AMAZON.NextIntent",
                    "samples": [
                        "di me la siguiente",
                        "siguiente cuestión",
                        "siguiente pregunta",
                        "dime la siguiente",
                        "siguiente",
                        "paso palabra",
                        "pasa palabra"
                    ]
                },
                {
                    "name": "AMAZON.NavigateHomeIntent",
                    "samples": []
                }
            ],
            "types": [
                {
                    "name": "animal",
                    "values": [
                        {
                            "id": "1",
                            "name": {
                                "value": "leon"
                            }
                        },
                        {
                            "id": "2",
                            "name": {
                                "value": "perro"
                            }
                        },
                        {
                            "id": "3",
                            "name": {
                                "value": "mono"
                            }
                        },
                        {
                            "id": "4",
                            "name": {
                                "value": "caballo"
                            }
                        },
                        {
                            "id": "5",
                            "name": {
                                "value": "lobo"
                            }
                        },
                        {
                            "id": "6",
                            "name": {
                                "value": "tigre"
                            }
                        },
                        {
                            "id": "7",
                            "name": {
                                "value": "gato"
                            }
                        }
                    ]
                }
            ]
        }
    }
}
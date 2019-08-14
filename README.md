- ajouter et supprimer des features facilement
- les features utilisent le core pour améliorer l'app ? (si demain le core change, je dois repasser sur toutes les features)
- le core à un seul endroit connait les features qui existent et les ajoutent à l'app. Si demain le core change, un seul endroit à modifier
- micro service proofing
- pouvoir changer l'infra facilement, différents protocols
- core feature, accessible depuis les autres features ?

- interfacage backoffice et frontend (encore niveau frontend c'est discutable) = on doit pouvoir facilement ajouter une feature qui viendra naturellement s'ajouter au backoffice

core:
- user
- profile

features:
- abo
- checkin
- rewards
- event management

feature doit pouvoir:
- s'interfacer avec le serveur HTTP
- s'interfacer avec pubsub (events)
- s'interfacer avec broker de message
- s'interfacer avec le logger
- s'interfacer avec le backoffice
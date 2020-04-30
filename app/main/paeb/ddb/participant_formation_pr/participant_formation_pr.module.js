(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.participant_formation_pr', [
            'app.paeb.ddb.participant_formation_pr.situation_participant_sep',
            'app.paeb.ddb.participant_formation_pr.situation_participant_dpp',
            'app.paeb.ddb.participant_formation_pr.situation_participant_emies',
            'app.paeb.ddb.participant_formation_pr.situation_participant_pmc',
            'app.paeb.ddb.participant_formation_pr.situation_participant_gfpc',
            'app.paeb.ddb.participant_formation_pr.classification_site',
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.participant_formation_pr', {
            title : 'Participant formation PR',
            icon  : 'icon-account-network',
            weight: 15
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.participant_formation_pr.classification_site', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_participant_formation_pr_classification_site', {
            url      : '/donnees-de-base/classification_site',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/participant_formation_pr/classification_site/classification_site.html',
                    controller : 'Classification_siteController as vm'
                }
            },
            bodyClass: 'classification_site',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "classification_site"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.participant_formation_pr.classification_site', {
            title: 'ODC',
            icon  : 'icon-ticket-account',
            state: 'app.paeb_ddb_participant_formation_pr_classification_site',
            weight: 6
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.classification_site', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_classification_site', {
            url      : '/donnees-de-base/classification_site',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/classification_site/classification_site.html',
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
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.classification_site', {
            title: 'Classification site',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_classification_site'
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.detail_subvention', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_detail_subvention', {
            url      : '/donnees-de-base/detail_subvention',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/detail_subvention/detail_subvention.html',
                    controller : 'Detail_subventionController as vm'
                }
            },
            bodyClass: 'detail_subvention',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Detail_subvention"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.ddb.detail_subvention', {
            title: 'Detail subvention',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_detail_subvention',
			weight: 5
        });
    }

})();

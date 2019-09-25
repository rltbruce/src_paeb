(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.plan_comptable', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_plan_comptable', {
            url      : '/donnees-de-base/plan_comptable',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/plan_comptable/plan_comptable.html',
                    controller : 'Plan_comptableController as vm'
                }
            },
            bodyClass: 'plan_comptable',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Plan_comptable"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.ddb.plan_comptable', {
            title: 'Plan comptable',
            icon  : 'icon-format-list-bulleted',
            state: 'app.paeb_ddb_plan_comptable',
			weight: 6
        });
    }

})();

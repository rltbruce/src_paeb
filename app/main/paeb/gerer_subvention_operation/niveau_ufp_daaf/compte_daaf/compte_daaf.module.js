(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_ufp_daaf.compte_daaf', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_operation_niveau_ufp_daaf_compte_daaf', {
            url      : '/donnees-de-base/gerer_subvention_operation/niveau_ufp_daaf/compte_daaf',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_operation/niveau_ufp_daaf/compte_daaf/compte_daaf.html',
                    controller : 'Compte_daafController as vm'
                }
            },
            bodyClass: 'compte_daaf',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "compte_daaf"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_operation.niveau_ufp_daaf.compte_daaf', {
            title: 'Compte Bancaire DAAF',
            icon  : 'icon-bank',
            state: 'app.paeb_gerer_subvention_operation_niveau_ufp_daaf_compte_daaf',
			weight: 5,
            hidden: function()
            {
                    return vs;
            }
        });
    }


    function testPermission(loginService,$cookieStore,apiFactory)
    {
        var id_user = $cookieStore.get('id');
       
        var permission = [];
        if (id_user > 0) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
               

                var permission = user.roles;
                var permissions = ["DAAF","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();

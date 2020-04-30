(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.prestation_pr.module_dpp.module_dpp_insertion', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_pr_prestation_pr_module_dpp_module_dpp_insertion', {
            url      : '/donnees-de-base/module_dpp_insertion',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_pr/prestation_pr/module_dpp/module_dpp_insertion/module_dpp_insertion.html',
                    controller : 'Module_dpp_insertionController as vm'
                }
            },
            bodyClass: 'module_dpp',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "module_dpp"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_pr.prestation_pr.module_dpp.module_dpp_insertion', {
            title: 'Insertion module',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_pr_prestation_pr_module_dpp_module_dpp_insertion',
			weight: 1,
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
                var permissions = ["OBCAF","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();

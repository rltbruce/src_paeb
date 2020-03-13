(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.prestation_pr.module_pmc.module_pmc_valide', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_pr_prestation_pr_module_pmc_module_pmc_valide', {
            url      : '/donnees-de-base/module_pmc_valide',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_pr/prestation_pr/module_pmc/module_pmc_valide/module_pmc_valide.html',
                    controller : 'Module_pmc_valideController as vm'
                }
            },
            bodyClass: 'module_pmc',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "module_pmc"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_pr.prestation_pr.module_pmc.module_pmc_valide', {
            title: 'Valide module',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_pr_prestation_pr_module_pmc_module_pmc_valide',
			weight: 2,
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
                var permissions = ["OBCAF"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();

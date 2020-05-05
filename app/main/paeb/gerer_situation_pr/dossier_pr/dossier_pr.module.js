(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.dossier_pr', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_pr_dossier_pr', {
            url      : '/donnees-de-base/dossier_pr',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_pr/dossier_pr/dossier_pr.html',
                    controller : 'Dossier_prController as vm'
                }
            },
            bodyClass: 'dossier_pr',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "dossier_pr"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_pr.dossier_pr', {
            title: 'Dossier pr',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_pr_dossier_pr',
			weight: 3,
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

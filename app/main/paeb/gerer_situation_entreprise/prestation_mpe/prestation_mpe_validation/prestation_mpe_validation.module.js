(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.prestation_mpe.prestation_mpe_validation', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_entreprise_prestation_mpe_prestation_mpe_validation', {
            url      : '/donnees-de-base/prestation_mpe_validation',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_entreprise/prestation_mpe/prestation_mpe_validation/prestation_mpe_validation.html',
                    controller : 'Prestation_mpe_validationController as vm'
                }
            },
            bodyClass: 'prestation_mpe_validation',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "prestation_mpe_validation"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.prestation_mpe.prestation_mpe_validation', {
            title: 'Prestation validation',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_entreprise_prestation_mpe_prestation_mpe_validation',
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
                var permissions = ["OBCAF"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();

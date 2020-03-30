(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.prestation_mpe.phase_sous_projet_validation', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_entreprise_prestation_mpe_phase_sous_projet_validation', {
            url      : '/donnees-de-base/phase_sous_projet_validation',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_entreprise/prestation_mpe/phase_sous_projet_validation/phase_sous_projet_validation.html',
                    controller : 'Phase_sous_projet_validationController as vm'
                }
            },
            bodyClass: 'phase_sous_projet_validation',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "phase_sous_projet_validation"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.prestation_mpe.phase_sous_projet_validation', {
            title: 'Phase validation',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_entreprise_prestation_mpe_phase_sous_projet_validation',
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

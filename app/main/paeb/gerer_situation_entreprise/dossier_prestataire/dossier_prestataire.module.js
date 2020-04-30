(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.dossier_prestataire', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_entreprise_dossier_prestataire', {
            url      : '/donnees-de-base/dossier_prestataire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_entreprise/dossier_prestataire/dossier_prestataire.html',
                    controller : 'Dossier_prestataireController as vm'
                }
            },
            bodyClass: 'dossier_prestataire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "dossier_prestataire"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.dossier_prestataire', {
            title: 'Dossier prestataire',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_entreprise_dossier_prestataire',
			weight: 10,
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

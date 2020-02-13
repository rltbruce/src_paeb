(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.payement_prestataire', [])
        .run(testPermission)
        .config(config);

        var vs;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_entreprise_payement_prestataire', {
            url      : '/donnees-de-base/payement_prestataire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_entreprise/payement_prestataire/payement_prestataire.html',
                    controller : 'Payement_prestataireController as vm'
                }
            },
            bodyClass: 'payement_prestataire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "payement_prestataire"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.payement_prestataire', {
            title: 'Payement MPE',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_entreprise_payement_prestataire',
			weight: 3,
            hidden:function()
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

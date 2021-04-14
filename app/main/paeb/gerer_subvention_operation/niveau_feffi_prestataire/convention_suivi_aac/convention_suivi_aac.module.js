(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_feffi_prestataire.convention_suivi_aac', [])
        .run(testPermission)
        .config(config);
    var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_operation_niveau_feffi_prestataire_convention_suivi_aac', {
            url      : '/donnees-de-base/gerer_subvention_operation/niveau_feffi_prestataire/convention_suivi_aac:rac?',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_operation/niveau_feffi_prestataire/convention_suivi_aac/convention_suivi_aac.html',
                    controller : 'Convention_suivi_aacController as vm'
                }
            },
            bodyClass: 'convention_suivi_aac',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN","AAC"],
              page: "convention_suivi_aac"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_operation.niveau_feffi_prestataire.convention_suivi_aac', {
            title: 'Validation activité technique (AAC)',
            icon  : 'icon-rotate-3d',
            state: 'app.paeb_gerer_subvention_operation_niveau_feffi_prestataire_convention_suivi_aac',
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
                var permissions = ["AAC","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();

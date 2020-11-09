(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_feffi_feffi.transfert_reliquat_bcaf', [])
        .run(testPermission)
        .config(config);
        var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_financiere_niveau_feffi_feffi_transfert_reliquat_bcaf', {
            url      : '/donnees-de-base/gerer_subvention_financiere/niveau_feffi_feffi/transfert_reliquat_bcaf',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_financiere/niveau_feffi_feffi/transfert_reliquat_bcaf/transfert_reliquat_bcaf.html',
                    controller : 'Transfert_reliquat_bcafController as vm'
                }
            },
            bodyClass: 'transfert_reliquat_bcaf',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "transfert_reliquat_bcaf"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_feffi_feffi.transfert_reliquat_bcaf', {
            title: 'Transfert reliquat validation',
            icon  : 'icon-link',
            state: 'app.paeb_gerer_subvention_financiere_niveau_feffi_feffi_transfert_reliquat_bcaf',
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
                var permissions = ["BCAF","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();

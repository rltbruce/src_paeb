(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.transfert_daaf', [])
        .run(testPermission)
        .config(config);

        var vs;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_niveau_daaf_feffi_financiere_transfert_daaf', {
            url      : '/donnees-de-base/gerer_subvention_financiere/niveau_daaf_feffi/transfert_daaf',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_financiere/niveau_daaf_feffi/transfert_daaf/transfert_daaf.html',
                    controller : 'Transfert_daafController as vm'
                }
            },
            bodyClass: 'transfert_daaf',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "transfert_daaf"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_daaf_feffi.transfert_daaf', {
            title: 'Transfert daaf',
            icon  : 'icon-tile-four',
            state: 'app.paeb_gerer_subvention_niveau_daaf_feffi_financiere_transfert_daaf',
            weight: 4,
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
                var permissions = ["DAAF"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();

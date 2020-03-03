(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_ufp_daaf.transfert_ufp', [])
        .run(testPermission)
        .config(config);
        var vs;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_financiere_niveau_ufp_daaf_transfert_ufp', {
            url      : '/donnees-de-base/gerer_subvention_financiere/niveau_ufp_daaf/transfert_ufp',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_financiere/niveau_ufp_daaf/transfert_ufp/transfert_ufp.html',
                    controller : 'Transfert_ufpController as vm'
                }
            },
            bodyClass: 'transfert_ufp',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "transfert_ufp"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_ufp_daaf.transfert_ufp', {
            title: 'Transfert ufp',
            icon  : 'icon-tile-four',
            state: 'app.paeb_gerer_subvention_financiere_niveau_ufp_daaf_transfert_ufp',
            weight: 1,
            badge:vs,
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
                var permissions = ["UFP"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
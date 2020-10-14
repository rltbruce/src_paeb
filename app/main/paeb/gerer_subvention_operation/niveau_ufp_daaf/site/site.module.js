(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_ufp_daaf.site', [])
        .run(testPermission) 
        .config(config);
var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_operation_niveau_ufp_daaf_site', {
            url      : '/donnees-de-base/site',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_operation/niveau_ufp_daaf/site/site.html',
                    controller : 'SiteController as vm'
                }
            },
            bodyClass: 'site',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "site"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_operation.niveau_ufp_daaf.site', {
            title: 'Insertion site',
            icon  : 'icon-nfc-variant',
            state: 'app.paeb_gerer_subvention_operation_niveau_ufp_daaf_site',
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
                var permissions = ["ODAAF","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();

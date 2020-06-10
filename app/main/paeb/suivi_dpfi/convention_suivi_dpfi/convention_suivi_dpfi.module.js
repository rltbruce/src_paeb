(function ()
{
    'use strict';

    angular
        .module('app.paeb.suivi_dpfi.convention_suivi_dpfi', [])
        .config(config);
        var vs;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_suivi_dpfi_convention_suivi_dpfi', {
            url      : '/donnees-de-base/convention_suivi_dpfi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/suivi_dpfi/convention_suivi_dpfi/convention_suivi_dpfi.html',
                    controller : 'Convention_suivi_dpfiController as vm'
                }
            },
            bodyClass: 'convention_suivi_dpfi',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_suivi_dpfi"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.suivi_dpfi.convention_suivi_dpfi', {
            title: 'Suivi convention (DPFI)',
            icon  : 'icon-rotate-3d',
            state: 'app.paeb_suivi_dpfi_convention_suivi_dpfi',
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
                var permissions = ["DPFI","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();

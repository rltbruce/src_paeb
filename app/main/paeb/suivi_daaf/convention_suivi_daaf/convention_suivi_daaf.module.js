(function ()
{
    'use strict';

    angular
        .module('app.paeb.suivi_daaf.convention_suivi_daaf', [])
        .config(config);
        var vs;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_suivi_daaf_convention_suivi_daaf', {
            url      : '/donnees-de-base/convention_suivi_daaf',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/suivi_daaf/convention_suivi_daaf/convention_suivi_daaf.html',
                    controller : 'Convention_suivi_daafController as vm'
                }
            },
            bodyClass: 'convention_suivi_daaf',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_suivi_daaf"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.suivi_daaf.convention_suivi_daaf', {
            title: 'Suivi convention (DAAF)',
            icon  : 'icon-rotate-3d',
            state: 'app.paeb_suivi_daaf_convention_suivi_daaf',
			weight: 3,
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
                var permissions = ["DAAF","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();

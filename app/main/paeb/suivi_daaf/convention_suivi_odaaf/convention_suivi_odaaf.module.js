(function ()
{
    'use strict';

    angular
        .module('app.paeb.suivi_daaf.convention_suivi_odaaf', [])
        .config(config);
        var vs;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_suivi_daaf_convention_suivi_odaaf', {
            url      : '/donnees-de-base/convention_suivi_odaaf',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/suivi_daaf/convention_suivi_odaaf/convention_suivi_odaaf.html',
                    controller : 'Convention_suivi_odaafController as vm'
                }
            },
            bodyClass: 'convention_suivi_odaaf',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_suivi_odaaf"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.suivi_daaf.convention_suivi_odaaf', {
            title: 'Suivi convention (O-DAAF)',
            icon  : 'icon-keyboard-variant',
            state: 'app.paeb_suivi_daaf_convention_suivi_odaaf',
			weight: 6,
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
                var permissions = ["OoDAAF","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();

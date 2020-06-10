(function ()
{
    'use strict';

    angular
        .module('app.paeb.convention_suivi_acc', [])
        .config(config);
        var vs;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_convention_suivi_acc', {
            url      : '/donnees-de-base/convention_suivi_acc',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/convention_suivi_acc/convention_suivi_acc.html',
                    controller : 'Convention_suivi_accController as vm'
                }
            },
            bodyClass: 'convention_suivi_acc',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_suivi_acc"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.convention_suivi_acc', {
            title: 'Suivi convention (ACC)',
            icon  : 'icon-keyboard-variant',
            state: 'app.paeb_convention_suivi_acc',
			weight: 7,
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
                var permissions = ["ACC","ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_feffi.decaiss_fonct_feffi_valide', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_feffi_decaiss_fonct_feffi_valide', {
            url      : '/donnees-de-base/decaiss_fonct_feffi_valide',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_feffi/decaiss_fonct_feffi_valide/decaiss_fonct_feffi_valide.html',
                    controller : 'Decaiss_fonct_feffi_valideController as vm'
                }
            },
            bodyClass: 'decaiss_fonct_feffi_valide',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "decaiss_fonct_feffi_valide"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_feffi.decaiss_fonct_feffi_valide', {
            title: 'Decaissement validée',
            icon  : 'icon-tile-four',
            state: 'app.paeb_gerer_situation_feffi_decaiss_fonct_feffi_valide',
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
                var permissions = ["OBCAF"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();

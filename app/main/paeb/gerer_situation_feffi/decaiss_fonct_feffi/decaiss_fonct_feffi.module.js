(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_feffi.decaiss_fonct_feffi', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_feffi_decaiss_fonct_feffi', {
            url      : '/donnees-de-base/decaiss_fonct_feffi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_feffi/decaiss_fonct_feffi/decaiss_fonct_feffi.html',
                    controller : 'Decaiss_fonct_feffiController as vm'
                }
            },
            bodyClass: 'decaiss_fonct_feffi',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "decaiss_fonct_feffi"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_feffi.decaiss_fonct_feffi', {
            title: 'Validation decaissement',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_feffi_decaiss_fonct_feffi',
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

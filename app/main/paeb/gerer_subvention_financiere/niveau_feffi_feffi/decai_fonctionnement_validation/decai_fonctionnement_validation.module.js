(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_feffi_feffi.decai_fonctionnement_validation', [])
        .run(testPermission)
        .run(insertiondemande_ufp_daaf_syst)
        .config(config);
        var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_financiere_niveau_feffi_feffi_decai_fonctionnement_validation', {
            url      : '/donnees-de-base/gerer_subvention_financiere/niveau_feffi_feffi/decai_fonctionnement_validation',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_financiere/niveau_feffi_feffi/decai_fonctionnement_validation/decai_fonctionnement_validation.html',
                    controller : 'Decai_fonctionnement_validationController as vm'
                }
            },
            bodyClass: 'decai_fonctionnement_validation',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "decai_fonctionnement_validation"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_feffi_feffi.decai_fonctionnement_validation', {
            title: 'Validation décaissement fonctionnement',
            icon  : 'icon-link',
            state: 'app.paeb_gerer_subvention_financiere_niveau_feffi_feffi_decai_fonctionnement_validation',
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

    function insertiondemande_ufp_daaf_syst($cookieStore,apiFactory,$interval,loginService)
    {
             var id_user = $cookieStore.get('id');

             if (id_user >0) 
             {
                     
                apiFactory.getAll("count_avancement_travaux/index").then(function(result)
                {
                    var allavan= result.data.response;
                    console.log(allavan);
                });
                

                    //**************************************************

                        $interval(function(){apiFactory.getAll("count_avancement_travaux/index").then(function(result)
                        {
                            var allavan= result.data.response;
                            console.log(allavan);
                        });},15000) ;
                  
                    //**************************************************

             } 
       
     
    }

})();

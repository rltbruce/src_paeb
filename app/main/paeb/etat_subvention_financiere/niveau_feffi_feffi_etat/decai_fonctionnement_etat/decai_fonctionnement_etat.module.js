(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_financiere.niveau_feffi_feffi_etat.decai_fonctionnement_etat', [])
        .config(config);
        var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_etat_subvention_financiere_niveau_feffi_feffi_etat_decai_fonctionnement_etat', {
            url      : '/donnees-de-base/etat_subvention_financiere/niveau_feffi_feffi_etat/decai_fonctionnement_etat',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/etat_subvention_financiere/niveau_feffi_feffi_etat/decai_fonctionnement_etat/decai_fonctionnement_etat.html',
                    controller : 'Decai_fonctionnement_etatController as vm'
                }
            },
            bodyClass: 'decai_fonctionnement_etat',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "decai_fonctionnement_etat"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_financiere.niveau_feffi_feffi_etat.decai_fonctionnement_etat', {
            title: 'Décaissement fonctionnement',
            icon  : 'icon-link',
            state: 'app.paeb_etat_subvention_financiere_niveau_feffi_feffi_etat_decai_fonctionnement_etat',
            weight: 1
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
                var permissions = ["OBCAF","ADMIN"];
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

(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_financiere.niveau_feffi_feffi_etat.addition_frais_fonctionnement_etat', [])
        .run(testPermission)
        //.run(insertiondemande_ufp_daaf_syst)
        .config(config);
        var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_etat_subvention_financiere_niveau_feffi_feffi_etat_addition_frais_fonctionnement_etat', {
            url      : '/donnees-de-base/etat_subvention_financiere/niveau_feffi_feffi_etat/addition_frais_fonctionnement_etat',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/etat_subvention_financiere/niveau_feffi_feffi_etat/addition_frais_fonctionnement_etat/addition_frais_fonctionnement_etat.html',
                    controller : 'Addition_frais_fonctionnement_etatController as vm'
                }
            },
            bodyClass: 'addition_frais_fonctionnement_etat',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "addition_frais_fonctionnement_etat"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_financiere.niveau_feffi_feffi_etat.addition_frais_fonctionnement_etat', {
            title: 'Addition frais fonctionnement',
            icon  : 'icon-link',
            state: 'app.paeb_etat_subvention_financiere_niveau_feffi_feffi_etat_addition_frais_fonctionnement_etat',
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
                var permissions = ["AAC","ADMIN"];
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

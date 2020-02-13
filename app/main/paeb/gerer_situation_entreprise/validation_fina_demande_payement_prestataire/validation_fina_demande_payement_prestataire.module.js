(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.validation_fina_demande_payement_prestataire', [])
        .run(notification)
        .config(config);

        var vs = {};
        var affichage;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_entreprise_validation_fina_demande_payement_prestataire', {
            url      : '/donnees-de-base/validation_fina_demande_payement_prestataire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_entreprise/validation_fina_demande_payement_prestataire/validation_fina_demande_payement_prestataire.html',
                    controller : 'Validation_fina_demande_payement_prestataireController as vm'
                }
            },
            bodyClass: 'validation_fina_demande_payement_prestataire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "validation_fina_demande_payement_prestataire"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.validation_fina_demande_payement_prestataire', {
            title: 'Validation financière',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_entreprise_validation_fina_demande_payement_prestataire',
			weight: 3,
            badge:vs,
            hidden:function()
            {
                    return affichage;
            }
        });
    }

    function notification($cookieStore,apiFactory,$interval,loginService)
    {
        var id_user = $cookieStore.get('id');

        if (id_user > 0) 
        {
            var permission = [];
            
            apiFactory.getDemande_realimentationByInvalide("count_demande_prestataire",Number(2)).then(function(resul) 
            {
                var x = resul.data.response;
                vs.content = x[0].nombre ;
                vs.color = '#F44336' ;
              console.log(x);

            });

            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
               

                var permission = user.roles;
                var permissions = ["DPFI"];
                affichage =  loginService.gestionMenu(permissions,permission);  

                //**************************************************
                if (id_user && !affichage) 
                {
                    $interval(function(){apiFactory.getDemande_realimentationByInvalide("count_demande_prestataire",Number(2)).then(function(resul) 
                    {
                        var resultat = resul.data.response;

                        if (vs.content != resultat[0].nombre) 
                        {
                            vs.content = resultat[0].nombre ;
                        };
                        
                    

                    });},15000) ;
                }
                //**************************************************
                      
                

            });
        }
     
    }

})();

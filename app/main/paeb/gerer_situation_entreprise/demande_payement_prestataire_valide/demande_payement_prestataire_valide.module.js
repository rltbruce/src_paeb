(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.demande_payement_prestataire_valide', [])
       
        .config(config);

        var vs = {};
        var affichage;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_entreprise_demande_payement_prestataire_valide', {
            url      : '/donnees-de-base/demande_payement_prestataire_valide',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_entreprise/demande_payement_prestataire_valide/demande_payement_prestataire_valide.html',
                    controller : 'Demande_payement_prestataire_valideController as vm'
                }
            },
            bodyClass: 'demande_payement_prestataire_valide',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "demande_payement_prestataire_valide"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.demande_payement_prestataire_valide', {
            title: 'Demande validée',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_entreprise_demande_payement_prestataire_valide',
			weight: 3
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

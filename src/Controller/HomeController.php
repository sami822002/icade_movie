<?php

namespace App\Controller;

use App\Form\MovieSearchType;
use App\Service\CallApiService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class HomeController extends AbstractController
{

    /**
     * @var CallApiService
     */
    private $callApiService;

    /**
     * @var CacheInterface
     */
    private $cache;

    /**
     * HomeController constructor.
     * @param CallApiService $callApiService
     * @param CacheInterface $cache
     */
    public function __construct(CallApiService $callApiService, CacheInterface $cache)
    {
        $this->callApiService = $callApiService;
        $this->cache = $cache;
    }

    /**
     * @Route("/", name="home")
     */
    public function index(Request $request): Response
    {
        $movieSearch = new class() {
            public $movieName;
        };

        $form = $this->createForm(MovieSearchType::class, $movieSearch);
        $form->add('movieName', TextType::class,
            ['label' => 'Film',
                'required' => false,
                'attr' => ['placeholder' => 'Nom du Film']]);
        $form->handleRequest($request);
        $genders = $this->getData('genders', 'getGendersData');
        $first = $this->getData('first_best_movies', 'getTopRated', []);
        $first_bestMovie = $first['results'][array_key_first($first['results'])];
        $firstBest = $this->getData('movie_id_' . $first_bestMovie['id'], 'getMovie', $first_bestMovie['id']);

        $response = $this->render('home/index.html.twig',
            ['form' => $form->createView(),
                'genders' => $genders['genres'],
                'moviesByGender' => isset($moviesByGender) ? $moviesByGender : [],
                'firstBest' => $firstBest,
            ]);
        return $response;
    }

    /**
     * @Route("/movies/{genderId}/{movieName}", name="movie_gender",methods={"GET"})
     */
    public function movieByGender($genderId, $movieName = null, Request $request): Response
    {
        $param = [];
        $movies = [];
        if (null != $genderId) {
            $param ['genderId'] = $genderId;
        }
        if (null != $movieName) {
            $param ['query'] = $movieName;
        }
//
        $moviesByGender = $this->getData('movies_by_gender_' . $genderId . '_' . $movieName, 'getTopRated', $param);

        foreach ($moviesByGender['results'] as $key => $movie) {
            if (in_array($genderId, array_values($movie['genre_ids']))) {
                $movies [] = $movie;
            }
        }
        $moviesByGender['results'] = $movies;
        return new JsonResponse($moviesByGender);
    }

    /**
     * @Route("/movie/{movieId}", name="Onemovie",methods={"GET"})
     */
    public function getDetaiMovie($movieId, Request $request): Response
    {

        $movie = $this->getData('movie_id_' . $movieId, 'getMovie', $movieId);
        return new JsonResponse($movie);
    }

    /**
     * @param $key
     * @param $function
     * @param null $param
     * @return mixed
     * @throws \Psr\Cache\InvalidArgumentException
     */
    public function getData($key, $function, $param = null)
    {
        return $this->cache->get($key, function (ItemInterface $item) use ($function, $param) {
            $item->expiresAfter(3600);
            return $this->callApiService->{$function}($param);
        });
    }
}

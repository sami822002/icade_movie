<?php

namespace App\Service;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * Class CallApiService
 * @package App\Service
 */
class CallApiService
{
    /**
     * @var HttpClientInterface
     */
    private $client;
    /**
     * @var string
     */
    private $api_key;

    /**
     * CallApiService constructor.
     * @param HttpClientInterface $client
     * @param ContainerInterface $container
     */
    public function __construct(HttpClientInterface $client, ContainerInterface $container)
    {
        $this->client = $client;
        $this->api_key = $container->getParameter('api_key');
    }

    /**
     * @return array
     */
    public function getGendersData(): array
    {
        return $this->getApi('genre/movie/list?');
    }

    /**
     * @param $movie_id
     * @return array
     */
    public function getMovie($movie_id): array
    {
        return $this->getApi('movie/' . $movie_id . '?append_to_response=videos&');
    }

    /**
     * @param null $param
     * @return array
     */
    public function getTopRated($param = null): array
    {
        $date = new \DateTime('now');
        $primary_release_year = $date->format('Y');
        $url = 'movie/top_rated?primary_release_year=' . $primary_release_year . '&sort_by=vote_average.desc';
        $genderParam = false;
        $queryParam = false;
        if (array_key_exists('genderId', $param)) {
            if ($param['genderId'] != null) {
                $genderParam = true;
            }
        }
        if (array_key_exists('query', $param)) {
            if ($param['query'] != null) {
                $queryParam = true;
            }
        }
        if ($genderParam && $queryParam) {
            $gender = '&with_genres=' . $param['genderId'];
            $url = 'search/movie?query=' . $param['query'] . $gender;
        } else if ($genderParam && $queryParam == false) {
            $gender = '&with_genres=' . $param['genderId'] . '&';
            $url .= $gender;
        }
        return $this->getApi($url);
    }

    /**
     * @param string $var
     * @return array
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     */
    private function getApi(string $var)
    {
        $response = $this->client->request(
            'GET',
            'https://api.themoviedb.org/3/' . $var . '&api_key=' . $this->api_key . '&language=fr-FR'
        );
        return $response->toArray();
    }
}
